function ShowHelloMessage() {
    var name = document.getElementById("name");
    document.getElementById("hellomessage").innerHTML = "Hello, " + name.value + ". Thanks for your feedback";
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    ShowHelloMessage();
});