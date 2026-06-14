const skills = document.querySelectorAll(".skill");

const textos = [

"🏆 SEU SORRISO (+100 felicidade)",

"🏆 SEU JEITO DE CUIDAR (+150 conforto)",

"🏆 SUA FORÇA (+200 admiração)",

"🏆 SEU ABRAÇO (+300 aconchego)",

"✨ VOCÊ (+999 amor)"
];

skills.forEach((skill, index)=>{

    setTimeout(()=>{

        skill.classList.remove("bloqueada");

        skill.classList.add("desbloqueada");

        skill.innerHTML = textos[index];

    },(index+1)*2000);

});

setTimeout(()=>{

    const botao = document.getElementById("continuar");

    botao.disabled = false;

    botao.innerHTML = "DESBLOQUEAR PRÓXIMA MISSÃO";

    botao.onclick = ()=>{

        window.location.href="album.html";

    };

},12000);