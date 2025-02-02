export class RecipeAdapter {
    static adapt(recipe) {
        return {
            name: recipe.name,
            description: recipe.description || '',
            ingredients: recipe.ingredients || [],  // Type: Array[{IngredientRecipe()}]
            steps: recipe.steps || [],
            image: recipe.image || '',
            userId: recipe.userId,
            isSubRecipe: recipe.isSubRecipe || false,
            prodoctWeight: recipe.prodoctWeight || 0
        };
    }
}