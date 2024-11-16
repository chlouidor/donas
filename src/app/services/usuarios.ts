export class Usuario {
    id: number;
    username: string;
    email: string;
    password: string; 
    imagen?: string;
    pregunta1?: string;
    respuesta1?: string;
    pregunta2?: string;
    respuesta2?: string;
    pregunta3?: string;
    respuesta3?: string;

    constructor(
        id: number = 0,  
        username: string,
        email: string,
        password: string,
        imagen?: string,
        pregunta1?: string,
        respuesta1?: string,
        pregunta2?: string,
        respuesta2?: string,
        pregunta3?: string,
        respuesta3?: string
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.imagen = imagen;
        this.pregunta1 = pregunta1;
        this.respuesta1 = respuesta1;
        this.pregunta2 = pregunta2;
        this.respuesta2 = respuesta2;
        this.pregunta3 = pregunta3;
        this.respuesta3 = respuesta3;
    }
}
