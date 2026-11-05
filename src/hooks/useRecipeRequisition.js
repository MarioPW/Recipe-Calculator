import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../context/MainContext';
import { formatNumber } from '../utilities/utils';

const UNIT_ALIASES = {
  g: 'g', gr: 'g', grs: 'g', gram: 'g', gramo: 'g', gramos: 'g',
  kg: 'kg', kgs: 'kg', kilo: 'kg', kilos: 'kg', kilogram: 'kg', kilogramo: 'kg', kilogramos: 'kg',
  mg: 'mg', miligram: 'mg', miligramo: 'mg', miligramos: 'mg',
  ml: 'ml', mls: 'ml', mililitro: 'ml', mililitros: 'ml', cc: 'ml',
  l: 'l', lt: 'l', lts: 'l', litro: 'l', litros: 'l', liter: 'l', liters: 'l',
  un: 'un', und: 'un', ud: 'un', uds: 'un', u: 'un', unidad: 'un', unidades: 'un',
  unit: 'un', units: 'un', pc: 'un', pcs: 'un', pza: 'un', pzas: 'un', pieza: 'un', piezas: 'un'
};

const UNIT_DEFINITIONS = {
  g: { factor: 1, family: 'mass', baseLabel: 'g' },
  kg: { factor: 1000, family: 'mass', baseLabel: 'g' },
  mg: { factor: 0.001, family: 'mass', baseLabel: 'g' },
  ml: { factor: 1, family: 'volume', baseLabel: 'ml' },
  l: { factor: 1000, family: 'volume', baseLabel: 'ml' },
  un: { factor: 1, family: 'count', baseLabel: 'un' }
};

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = typeof value === 'number'
    ? value
    : parseFloat(String(value).trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getUnitInfo = (unitOfMeasure) => {
  const rawUnit = (unitOfMeasure || '').toString().trim();
  const normalizedUnit = rawUnit.toLowerCase().replace(/\./g, '');
  const alias = UNIT_ALIASES[normalizedUnit];

  if (alias && UNIT_DEFINITIONS[alias]) {
    return { ...UNIT_DEFINITIONS[alias], unit: alias };
  }

  return {
    factor: 1,
    family: `custom:${normalizedUnit || 'unit'}`,
    baseLabel: rawUnit || 'un',
    unit: rawUnit || 'un'
  };
};

const toBaseQuantity = (quantity, unitOfMeasure) => {
  const unitInfo = getUnitInfo(unitOfMeasure);
  return {
    baseQuantity: quantity * unitInfo.factor,
    family: unitInfo.family,
    baseLabel: unitInfo.baseLabel
  };
};

const fromBaseQuantity = (baseQuantity, family, baseLabel) => {
  if (family === 'mass' && Math.abs(baseQuantity) >= 1000) {
    return { quantity: baseQuantity / 1000, unitOfMeasure: 'kg' };
  }
  if (family === 'volume' && Math.abs(baseQuantity) >= 1000) {
    return { quantity: baseQuantity / 1000, unitOfMeasure: 'l' };
  }
  return { quantity: baseQuantity, unitOfMeasure: baseLabel };
};

const roundQuantity = (value) => Number(value.toFixed(4));

const aggregateRequisition = (entries, recipes) => {
  const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const accumulator = new Map();

  const addIngredient = (name, unitInfo, baseQuantity) => {
    const ingredientName = (name || '').toString().trim();
    if (!ingredientName || baseQuantity <= 0) return;

    const key = `${ingredientName.toLowerCase()}|${unitInfo.family}`;
    const current = accumulator.get(key);

    if (current) {
      current.baseQuantity += baseQuantity;
      return;
    }

    accumulator.set(key, {
      name: ingredientName,
      family: unitInfo.family,
      baseLabel: unitInfo.baseLabel,
      baseQuantity
    });
  };

  const expandRecipe = (recipe, requiredBaseQuantity, visited) => {
    const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
    if (ingredients.length === 0) return;

    const weightedIngredients = ingredients.map((ingredient) => {
      const unitInfo = toBaseQuantity(parseNumber(ingredient.weight), ingredient.unitOfMeasure);
      return { ingredient, unitInfo };
    });

    const totalWeight = weightedIngredients.reduce(
      (total, { unitInfo }) => total + unitInfo.baseQuantity,
      0
    );

    if (totalWeight <= 0) return;

    weightedIngredients.forEach(({ ingredient, unitInfo }) => {
      const requiredQuantity = requiredBaseQuantity * (unitInfo.baseQuantity / totalWeight);

      if (ingredient.isSubRecipe) {
        const subRecipe = recipesById.get(ingredient.id);
        if (subRecipe && !visited.has(subRecipe.id)) {
          expandRecipe(
            subRecipe,
            requiredQuantity,
            new Set([...visited, subRecipe.id])
          );
          return;
        }
      }

      addIngredient(ingredient.name, unitInfo, requiredQuantity);
    });
  };

  entries.forEach((entry) => {
    const recipe = recipesById.get(entry.id);
    const quantity = parseNumber(entry.quantity);
    const weightPerUnit = parseNumber(entry.weightPerUnit);

    if (!recipe || quantity <= 0 || weightPerUnit <= 0) return;

    expandRecipe(
      recipe,
      quantity * weightPerUnit,
      new Set([recipe.id])
    );
  });

  return Array.from(accumulator.values())
    .map((item) => {
      const { quantity, unitOfMeasure } = fromBaseQuantity(
        item.baseQuantity,
        item.family,
        item.baseLabel
      );

      return {
        name: item.name,
        quantity: roundQuantity(quantity),
        unitOfMeasure
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

const buildEntry = (recipe) => ({
  id: recipe.id,
  name: recipe.name,
  quantity: '',
  weightPerUnit: recipe.productWeight ?? '',
  isSubRecipe: Boolean(recipe.isSubRecipe),
  selected: false
});

export const useRecipeRequisition = () => {
  const { t } = useTranslation();
  const { recipes } = useMainContext();

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requisition, setRequisition] = useState([]);
  const [totals, setTotals] = useState({ products: 0, weight: 0 });
  const [isResultsView, setIsResultsView] = useState(false);
  const [error, setError] = useState('');
  const [calculatedRecipes, setCalculatedRecipes] = useState([]);

  useEffect(() => {
    setEntries((currentEntries) => {
      const currentById = new Map(currentEntries.map((entry) => [entry.id, entry]));

      return recipes.map((recipe) => {
        const current = currentById.get(recipe.id);
        if (!current) return buildEntry(recipe);

        return {
          ...current,
          name: recipe.name,
          isSubRecipe: Boolean(recipe.isSubRecipe),
          weightPerUnit: current.weightPerUnit === '' || current.weightPerUnit === undefined
            ? recipe.productWeight ?? ''
            : current.weightPerUnit
        };
      });
    });

    setIsLoading(false);
  }, [recipes]);

  const updateEntry = useCallback((id, field, value) => {
    setError('');
    setEntries((currentEntries) =>
      currentEntries.map((entry) => {
        if (entry.id !== id) return entry;

        const updatedEntry = { ...entry, [field]: value };

        if (field === 'quantity' && parseNumber(value) > 0) {
          updatedEntry.selected = true;
        }

        return updatedEntry;
      })
    );
  }, []);

  const toggleEntry = useCallback((id) => {
    setError('');
    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === id ? { ...entry, selected: !entry.selected } : entry
      )
    );
  }, []);

  const selectOnlyRecipes = useCallback(() => {
    setError('');
    setEntries((currentEntries) =>
      currentEntries.map((entry) => ({
        ...entry,
        selected: !entry.isSubRecipe
      }))
    );
  }, []);

  const selectOnlySubRecipes = useCallback(() => {
    setError('');
    setEntries((currentEntries) =>
      currentEntries.map((entry) => ({
        ...entry,
        selected: entry.isSubRecipe
      }))
    );
  }, []);

  const entryRows = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        requiredWeight: parseNumber(entry.quantity) * parseNumber(entry.weightPerUnit)
      })),
    [entries]
  );

  const selectedEntries = useMemo(
    () => entryRows.filter((entry) => entry.selected),
    [entryRows]
  );

  const recipesById = useMemo(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe])),
    [recipes]
  );

  const calculate = useCallback(() => {
    const entriesWithQuantity = selectedEntries.filter(
      (entry) => parseNumber(entry.quantity) > 0
    );

    if (entriesWithQuantity.length === 0) {
      setError('myRecipes.calculationRequired');
      return;
    }

    const calculatedRequisition = aggregateRequisition(entriesWithQuantity, recipes);

    if (calculatedRequisition.length === 0) {
      setError('myRecipes.calculationRequired');
      return;
    }

    const calculatedTotals = entriesWithQuantity.reduce(
      (accumulator, entry) => ({
        products: accumulator.products + parseNumber(entry.quantity),
        weight: accumulator.weight + entry.requiredWeight
      }),
      { products: 0, weight: 0 }
    );

    const usedRecipes = entriesWithQuantity.map((entry) => {
      const recipe = recipesById.get(entry.id);

      return {
        id: entry.id,
        name: recipe?.name || entry.name || t('myRecipes.defaultRecipe'),
        quantity: parseNumber(entry.quantity)
      };
    });

    setError('');
    setRequisition(calculatedRequisition);
    setTotals(calculatedTotals);
    setCalculatedRecipes(usedRecipes);
    setIsResultsView(true);
  }, [selectedEntries, recipes, recipesById, t]);

  const backToInputs = useCallback(() => {
    setIsResultsView(false);
    setCalculatedRecipes([]);
  }, []);

  const requisitionExportData = useMemo(
    () => ({
      title: t('myRecipes.requisitionTitle'),
      tableData: requisition.map((item) => ({
        [t('myRecipes.ingredient')]: item.name,
        [t('myRecipes.requiredQuantity')]: `${formatNumber(item.quantity)} ${item.unitOfMeasure}`.trim()
      })),
      summary: {
        [t('myRecipes.totalProducts')]: formatNumber(totals.products),
        [t('myRecipes.totalWeight')]: `${formatNumber(totals.weight)} g`
      }
    }),
    [requisition, totals, t]
  );

  return {
    t,
    recipes,
    entries: entryRows,
    requisition,
    totals,
    calculatedRecipes,
    isLoading,
    selectedCount: selectedEntries.length,
    isResultsView,
    error,
    calculate,
    backToInputs,
    updateEntry,
    toggleEntry,
    selectOnlyRecipes,
    selectOnlySubRecipes,
    requisitionExportData
  };
};
