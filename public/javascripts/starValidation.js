const stars = document.querySelectorAll('.s');
const a = document.querySelector('.a');

let isClicked = false;


for (let s of stars) {
    s.addEventListener('click', () => {
        isClicked = true;
    })
}


a.addEventListener('click', (e) => {
    if (!isClicked) {
        e.preventDefault();
    }
})