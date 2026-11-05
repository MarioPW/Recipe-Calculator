import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmountWeightModal } from './AmountWeightModal';
import { EditRecipeIngredient } from './EditRecipeIngredient';
import { AddIngredient } from './AddIngredient';
import { RemoveIngredientModal } from './RemoveIngredientModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
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
