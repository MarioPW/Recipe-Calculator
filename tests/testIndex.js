// Importamos las dependencias necesarias
import { isRepeated } from '../src/services/utils.js';
import { ui } from '../src/ui.js';
import '@testing-library/jest-dom/extend-expect'; // Para usar matchers como .toBeInTheDocument()

// Mockeamos las funciones que serán usadas en el test
jest.mock('../src/services/utils.js');
jest.mock('../src/ui.js', () => ({
    showHideWindows: jest.fn(),
    getName: jest.fn(),
}));

describe('Recipe Name Submission', () => {
    beforeEach(() => {
        // Creamos un DOM simulado
        document.body.innerHTML = `
            <form id="recipeName">
                <input type="text" id="name" />
            </form>
            <div id="recipeViewContainer" class="some-class"></div>
        `;
    });

    test('should call alert if recipe name already exists', () => {
        // Mockeamos la función isRepeated para que devuelva true
        isRepeated.mockReturnValue(true);

        // Espiamos la función alert
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Simulamos el envío del formulario
        document.querySelector("#name").value = "My Recipe";
        const form = document.querySelector("#recipeName");
        form.dispatchEvent(new Event('submit'));

        // Verificamos que se llamó a alert con el mensaje esperado
        expect(alertMock).toHaveBeenCalledWith('Recipe name "MY RECIPE" already exists');

        // Restauramos la función alert original
        alertMock.mockRestore();
    });

    test('should call ui.showHideWindows and ui.getName if recipe name does not exist', () => {
        // Mockeamos la función isRepeated para que devuelva false
        isRepeated.mockReturnValue(false);

        // Simulamos el envío del formulario
        document.querySelector("#name").value = "My Recipe";
        const form = document.querySelector("#recipeName");
        form.dispatchEvent(new Event('submit'));

        // Verificamos que se llamó a ui.showHideWindows con los argumentos correctos
        expect(ui.showHideWindows).toHaveBeenCalledWith("#recipeViewContainer", "card p-3 shadow rounded-0");

        // Verificamos que se llamó a ui.getName con el nombre en mayúsculas
        expect(ui.getName).toHaveBeenCalledWith("MY RECIPE");
    });
});