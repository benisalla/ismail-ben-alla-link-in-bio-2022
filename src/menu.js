import gsap from "gsap";

var card = document.getElementById("activator");
var tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

var toggle = false;

tl.to(".activator", {
    background: "#0a6061",
    borderRadius: "5em 0 0 5em",
});
tl.to(
    "nav",
    {
        clipPath: "ellipse(100% 100% at 50% 50%)",
    },
    "-=.5"
);
tl.to(
    ".menu-nav img",
    {
        opacity: 1,
        transform: "translateX(0)",
        stagger: 0.05,
        boxShadow: "none",
    },
    "-=.5"
);
tl.pause();

card.addEventListener("click", () => {
    toggle = !toggle;
    if (toggle ? tl.play() : tl.reverse());
});

document.getElementById("full-screen").addEventListener('click', ()=>{
    document.querySelectorAll(".ClearScreenTarget").forEach( element => {
        element.classList.toggle("not-working")
    })
});