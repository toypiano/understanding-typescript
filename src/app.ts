const button = document.querySelector('button')!; // ! tells TS that it is returning non-null.
button.addEventListener('click', () => {
  console.log('clicked!');
});
