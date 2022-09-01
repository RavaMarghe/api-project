import multer from "multer";

export const multerOptions = {}

export const initMulterMiddelware = () => {
    return multer(multerOptions)
}
