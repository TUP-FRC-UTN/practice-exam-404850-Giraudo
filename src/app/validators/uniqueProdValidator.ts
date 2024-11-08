import { FormArray, ValidationErrors } from "@angular/forms";

export function uniqueProductValidator(porductsArray: FormArray): ValidationErrors | null {
    
    const selectedProductsIds = porductsArray.controls.map(control => control.get('prodName')?.value as number);

    console.log(selectedProductsIds)

    const hasDuplicates = selectedProductsIds.some((id, index) => selectedProductsIds.indexOf(id) !== index);

    console.log("hola", hasDuplicates )

    return hasDuplicates ? { duplicated: true } : null
}