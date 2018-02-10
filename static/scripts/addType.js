$(function() {
    let idToEdit = parseInt(localStorage.getItem('pointId'));
    
    if (idToEdit > 0) {
        getPointToEdit(idToEdit);
        
        localStorage.removeItem('pointId');
    }
    let types = [];
    getTypes();

    function getPointToEdit(id) {
        $.ajax({
            url: `getPoint/${id}`,
            type: 'GET',
            success: function(resp) {
                console.log(resp);
                $('div#id').text(idToEdit);
                // resp[0].coordinates, 
                $('input[type=text]#name').val(resp[0].name);
                $('input[type=text]#address').val(resp[0].address);
                $('textarea#comment').val(resp[0].comment);
                $('select#type').val(resp[0].pointType);
                $('input[type=number]#latitude').val(parseFloat(resp[0].coordinates.split(" ")[0]));
                $('input[type=number]#longitude').val(parseFloat(resp[0].coordinates.split(" ")[resp[0].coordinates.split(" ").length - 1]));
            },
            error: function(err) {
                console.log('error getting point to edit');
                console.error(err);
            }
        });
    }

    function getTypes() {
        $.ajax({
            url: 'getTypes',
            type: 'GET',
            success: function(resp) {
                let $select = $('select#type');
                $select.empty();
                console.log(resp);
                for(let i = 0; i < resp.length; i++) {
                    $select.append($("<option>", {
                        value: resp[i]['typeId'],
                        name: resp[i]['name'],
                        text: resp[i]['name']
                      }));
                }
            },
            error: function(err) {
                console.log('error getting types');
                console.error(err);
            }
        });
    }

    $('button#addNewType').on('click', function() {
        $('div#typeForm').slideToggle();
    });

    $('button#submitType').on('click', function() {
        let _name = JSON.stringify($('input[type=text]#geopoint').val());
        $.ajax({
            url: `addNewType/${_name}`,
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
            // data: _data,
            success: function(resp) {
                console.log(resp.response);
                getTypes();
            },
            error: function(err) {
                console.log("from error");
                console.error(err);
            }
        });
    });

    $('button#submitPoint').on('click', function(event){
        event.preventDefault();
        let _id = `"${$('div#id').text()}"`
        let _name = `"${$('input[type=text]#name').val()}"`;
        let _address = `"${$('input[type=text]#address').val()}"`;
        let _coordinates = `"${$('input[type=number]#latitude').val()}    ${$('input[type=number]#longitude').val()}"`;
        let _type = $('select#type').find('option:selected').val();
        let _comment = `"${$('textarea#comment').val()}"`;
        let _data = {
            id: _id,
            name: _name,
            address: _address,
            coordinates: _coordinates,
            type: _type,
            comment: _comment
        }
        console.log(_data);
        let _typePost = (idToEdit > 0) ? 'PUT' : 'POST';
        let _url = (_typePost == 'PUT') ? 'updatePoint/' : 'addNewPoint/';
        $.ajax({
            url: _url,
            type: _typePost,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(resp) {
                console.log(resp.response);
                // getTypes();
            },
            error: function(err) {
                console.log("from error");
                console.error(err);
            }
        });
        
    });

    
});