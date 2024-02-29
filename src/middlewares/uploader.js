import multer from "multer"
import { __dirname } from "../utils.js"
import { logger } from "../utils/logger.js"
// TODO: Crear un middleware con multer que permita guardar en diferentes carpetas los diferentes archivos
// TODO: Modificar la función para que dependiendo del archivo lo guarde en una carpeta u otra

let folder = `${__dirname}/public/assets`

const storage = multer.diskStorage({
	/*
	 * Imagen de perfil -> /profiles
	 * Imagen de producto -> /products
	 * Un documento -> /documents //? (Identificación, Comprobante de domicilio, Comprobante de estado de cuenta)
	 */
	destination: function (req, file, cb) {
		//* Identificar cuando es un tipo de archivo perfil, producto o documento
		// const user = req.user
		// console.log(user)
		// if (!user.documents.every((document) => requiredDocuments.includes(document.name)))
		// console.log(file)
		switch (file.fieldname) {
			case "perfil":
				cb(null, `${folder}/profiles`)
				break
			case "productos":
				cb(null, `${folder}/products`)
				break
			case "identificacion":
				cb(null, `${folder}/documents`)
				break
			case "domicilio":
				cb(null, `${folder}/documents`)
				break
			case "cuenta":
				cb(null, `${folder}/documents`)
				break
			default:
				break
		}
	},
	filename: function (req, file, cb) {
		// const user = req.user
		// if(!user.documents.find(doc => doc.name === file.fieldname)){
		// }
		cb(null, `${Date.now()}-${file.originalname}`)
		// logger.warning(`El archivo con nombre ${file.fieldname} ya se encuentra subido`)
	}
})

const uploader = multer({ storage })

export default uploader
