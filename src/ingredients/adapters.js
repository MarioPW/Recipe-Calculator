export class Ingredient {
    constructor({
        name,
        unitOfMeasure,
        brand = null,
        supplier = null,
        costPerKg = null,
        expirationDate = null,
        batch = null
        })
    {
        this.name = name
        this.unitOfMeasure = unitOfMeasure
        this.costPerKg = costPerKg
        this.supplier = supplier
        this.brand = brand
        this.expirationDate = expirationDate
        this.batch = batch
    }
}