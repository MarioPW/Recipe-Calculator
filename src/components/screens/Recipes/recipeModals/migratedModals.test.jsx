import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmountWeightModal } from './AmountWeightModal';
import { EditRecipeIngredient } from './EditRecipeIngredient';
import { AddIngredient } from './AddIngredient';
import { RemoveIngredientModal } from './RemoveIngredientModal';
import { CostModal } from './CostModal';
import { TraceabilityModal } from './TraceabilityModal';
import { CalculatedRecipeModal } from './CalculatedRecipeModal';
import { RecipeFeaturesModal } from './RecipeFeaturesModal';
import { AddIngredientModal } from './AddIngredientModal';
import { AddSubRecipeModal } from './AddSubRecipeModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}));

vi.mock('../../../../context/MainContext', () => ({
  useMainContext: () => ({ recipes: [] })
}));

describe('AmountWeightModal', () => {
  it('renders both inputs and calls close and save handlers', () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(
      <AmountWeightModal
        handleAmountWeightModal={onClose}
        amount="2"
        setAmount={vi.fn()}
        weightPerUnit="10"
        setWeightPerUnit={vi.fn()}
        handleSaveAmountWeight={onSave}
        operation="common.save"
      />
    );

    expect(screen.getByLabelText('amountWeightModal.amount:')).toHaveValue(2);
    expect(screen.getByLabelText('amountWeightModal.weightPerUnit:')).toHaveValue(10);

    fireEvent.click(screen.getByRole('button', { name: 'common.save' }));
    expect(onSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle('common.close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('AddIngredient', () => {
  it('appends the ingredient preserving isSubRecipe', () => {
    const setRecipe = vi.fn();
    const onDone = vi.fn();

    render(
      <AddIngredient
        setWeightModal={vi.fn()}
        ingredient={{ id: 'i1', name: 'Flour', unitOfMeasure: 'g', isSubRecipe: true }}
        currentRecipe={{ id: 'r1', ingredients: [] }}
        handleAddIngredientModal={onDone}
        setRecipe={setRecipe}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '250' } });
    fireEvent.click(screen.getByRole('button', { name: 'addIngredient.save' }));

    expect(setRecipe).toHaveBeenCalledWith({
      id: 'r1',
      ingredients: [
        { id: 'i1', name: 'Flour', unitOfMeasure: 'g', isSubRecipe: true, weight: '250' }
      ]
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('does not save a zero weight', () => {
    const setRecipe = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <AddIngredient
        setWeightModal={vi.fn()}
        ingredient={{ id: 'i1', name: 'Flour' }}
        currentRecipe={{ ingredients: [] }}
        handleAddIngredientModal={vi.fn()}
        setRecipe={setRecipe}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'addIngredient.save' }));

    expect(setRecipe).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});

describe('EditRecipeIngredient', () => {
  it('updates the weight and preserves isSubRecipe', () => {
    const setRecipe = vi.fn();
    const setEditIngredient = vi.fn();

    render(
      <EditRecipeIngredient
        ingredient={{ id: 'i1', name: 'Flour', weight: 100, unitOfMeasure: 'g', isSubRecipe: true }}
        recipe={{ id: 'r1', ingredients: [{ id: 'i1', name: 'Flour', weight: 100, isSubRecipe: true }] }}
        setRecipe={setRecipe}
        setEditIngredient={setEditIngredient}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '300' } });
    fireEvent.click(screen.getByRole('button', { name: 'common.save' }));

    expect(setRecipe).toHaveBeenCalledWith({
      id: 'r1',
      ingredients: [
        { id: 'i1', name: 'Flour', weight: '300', unitOfMeasure: 'g', isSubRecipe: true }
      ]
    });
    expect(setEditIngredient).toHaveBeenCalledWith(false);
  });
});

describe('RemoveIngredientModal', () => {
  it('removes the ingredient without mutating the original recipe', () => {
    const setRecipe = vi.fn();
    const setRemoveIngredient = vi.fn();
    const recipe = {
      id: 'r1',
      ingredients: [
        { id: 'i1', name: 'Flour' },
        { id: 'i2', name: 'Salt' }
      ]
    };

    render(
      <RemoveIngredientModal
        ingredient={recipe.ingredients[0]}
        recipe={recipe}
        setRecipe={setRecipe}
        setRemoveIngredient={setRemoveIngredient}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'common.remove' }));

    expect(recipe.ingredients).toHaveLength(2);
    expect(setRecipe).toHaveBeenCalledWith({
      id: 'r1',
      ingredients: [{ id: 'i2', name: 'Salt' }]
    });
    expect(setRemoveIngredient).toHaveBeenCalledWith(false);
  });
});

describe('CostModal', () => {
  it('renders the export action and closes from header and footer', () => {
    const onClose = vi.fn();

    render(
      <CostModal
        handleCostModal={onClose}
        recipeCosts={{
          name: 'Pie',
          costPerUnit: 10,
          totalCost: 100,
          amount: 10,
          weightPerUnit: 100,
          ingredients: [{ name: 'Flour', cost: 5, percentage: 50, requiredQuantity: 200, unitOfMeasure: 'g' }]
        }}
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'cost-modal');
    expect(screen.getByText('Flour')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'download.export' })).toBeInTheDocument();

    screen.getAllByRole('button', { name: 'common.close' }).forEach((button) => fireEvent.click(button));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('TraceabilityModal', () => {
  it('uses a modal header instead of a SecondaryNavbar', () => {
    const onClose = vi.fn();

    render(
      <TraceabilityModal
        handleTraceabilityModal={onClose}
        traceability={{
          name: 'Pie',
          weightPerUnit: 100,
          amount: 10,
          ingredients: [{ reference: 'REF-1', name: 'Flour', batch: 'B1', expirationDate: '2026-01-01', calculatedProportion: 200, unitOfMeasure: 'g' }]
        }}
      />
    );

    expect(document.querySelector('nav')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'traceability-modal');
    expect(screen.getByText('REF-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'download.export' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('CalculatedRecipeModal', () => {
  it('renders the summary and the conversions table', () => {
    const onClose = vi.fn();

    render(
      <CalculatedRecipeModal
        recipeData={{ name: 'Pie', amount: 10, weightPerUnit: 100 }}
        convertions={[{ name: 'Flour', conversion: 200, unitOfMeasure: 'g' }]}
        handleConvertionsModal={onClose}
      />
    );

    expect(screen.getByText('calculatedRecipeModal.recipe: Pie')).toBeInTheDocument();
    expect(screen.getByText('Flour')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('RecipeFeaturesModal', () => {
  it('saves changes through the modal form', () => {
    const setRecipe = vi.fn();
    const setRecipeFeaturesModal = vi.fn();

    render(
      <RecipeFeaturesModal
        setRecipeFeaturesModal={setRecipeFeaturesModal}
        recipe={{ name: 'Pie', description: 'Desc', steps: [], isSubRecipe: false, productWeight: 100 }}
        setRecipe={setRecipe}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'common.saveChanges' }));

    expect(setRecipe).toHaveBeenCalledWith(expect.objectContaining({ name: 'Pie', productWeight: 100 }));
    expect(setRecipeFeaturesModal).toHaveBeenCalledWith(false);
  });
});

describe('AddIngredientModal', () => {
  it('opens the nested weight modal and Escape only closes the nested one', () => {
    const onClose = vi.fn();

    render(
      <AddIngredientModal
        handleAddIngredientModal={onClose}
        allIngredients={[{ id: 'i1', name: 'Flour' }]}
        setRecipe={vi.fn()}
        currentRecipe={{ ingredients: [] }}
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'add-ingredient-modal');

    fireEvent.click(screen.getByText('Flour'));
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'add-ingredient-modal');
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('AddSubRecipeModal', () => {
  it('lists only sub recipes', () => {
    render(
      <AddSubRecipeModal
        handleAddSubRecipeModal={vi.fn()}
        recipes={[
          { id: 'r1', name: 'Base', isSubRecipe: true },
          { id: 'r2', name: 'Final', isSubRecipe: false }
        ]}
        setRecipe={vi.fn()}
        currentRecipe={{ ingredients: [] }}
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('id', 'add-sub-recipe-modal');
    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.queryByText('Final')).not.toBeInTheDocument();
  });
});
