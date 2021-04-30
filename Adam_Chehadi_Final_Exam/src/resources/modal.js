function openModal() {
    var f_inp = document.getElementById("f_inp");
    var f_ta = document.getElementById("f_ta");
    var row_1 = document.getElementById("row_1");
    var row_2 = document.getElementById("row_2");
    
    if(f_inp == null) {
        var movie = document.getElementById("movie_title");
        const form_input = document.createElement("form_input");
        form_input.className = 'form-control col-8';
        form_input.id = 'f_inp';
        form_input.name = 'f_inp';
        form_input.placeholder = movie.innerHTML;
        form_input.defaultValue = movie.innerHTML;
        form_input.readOnly = true;
    
        r1.appendChild(form_input);
    }

    if(f_ta == null) {
        const form_text_area = document.createElement("form_text_area");
        form_text_area.className = 'form-control col-8';
        form_text_area.id = 'f_ta';
        form_text_area.name = 'f_ta';
        form_text_area.rows = 5;
    
        r2.appendChild(form_text_area);
    }

}

function closeModal() {
    var f_inp = document.getElementById("f_inp");
    var f_ta = document.getElementById("f_ta");

    f_inp.remove();
    f_ta.remove();
}