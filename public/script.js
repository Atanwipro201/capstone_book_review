console.log("i am alive")
 function hide(i) {
    const element = document.getElementById("edit"+i);
    const element2 = document.getElementById("noedit"+i);
    element.classList.remove("hidden");  // Remove mystyle class
    element2.classList.add("hidden");  // Add newone class
 };
 function show(i) {
    const element = document.getElementById("edit"+i);
    const element2 = document.getElementById("noedit"+i);
    element2.classList.remove("hidden");  // Remove mystyle class
    element.classList.add("hidden");  // Add newone class
 }