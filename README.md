# Presto Ma Dose
## Utiliser sur Doctolib
Copier ce code et lancez-le dans le console :

```javascript
let script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/gh/user038418/prestomadose/dose_covid.js";
document.body.appendChild(script);

let button = document.createElement('button');
button.setAttribute('onclick', 'desktop()');
button.innerText = "Trouver un rendez-vous";
button.id = "prestoMaDose";
button.setAttribute('style', "position: fixed;bottom: 0;right: 0;z-index: 11;background-color: #0596de;border: none;border-radius: .5rem 0 0;font-size: 1.5rem;padding: .5rem 1rem;color: #ffffff;box-shadow: 0 2px 10px 0 rgb(67 95 113 / 69%);");
document.body.appendChild(button);
```
