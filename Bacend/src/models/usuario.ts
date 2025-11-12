//crear un modelo usuario con los atributos id, username, gmail, password y bithrday
import mongoose, { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

//creo la inerfaz de usuario que utilizaré como esquema de mongoose
export interface IUsuario {
    _id: Types.ObjectId;
    username: string;
    gmail: string;
    password: string;
    birthday: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    isModified(path: string): boolean;
    }

//creo el esquema de usuario y si nos fijamos, el atributo id no es obligatorio ya que mongoose lo crea automáticamente
const usuarioSchema = new Schema<IUsuario>({
    username: { type: String, required: true, unique: true },
    gmail: { type: String, required: true, unique: true },
    //pone unique para que no se repita el correo ni el username entre todos los usuarios de la base de datos
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
}, {
    timestamps: false,
    versionKey: false
});



//encriptar la contraseña antes de guardarla en la base de datos HOOK DE MONGOOSE
usuarioSchema.pre<IUsuario>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt();    
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});



//método para comparar la contraseña ingresada con la contraseña encriptada en la base de datos
usuarioSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};



//guardamos en una variable exportable el modelo usuario, tiene similitud cuando en DSA llamabamos a una clase(objeto)
//ya que el funcionamiento es similar.
export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
//exporto el modelo usuario
export default Usuario;

