import  firebase from 'firebase';


export class Presence{
    constructor(){}

    online(){
        setInterval(()=>{
            firebase.database().ref('usuarios/').update({})
        })
    } 
}