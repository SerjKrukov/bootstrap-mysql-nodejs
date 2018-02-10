$(function() {
    let types = [];
    getTypes();
    let id;
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
    $("#name").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("select#type option").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        $('#editName').val('');
        $(`div#confirm-container`).slideUp();
      });
      $('#editName').on("keyup", function() {
        $(`div#confirm-container`).slideUp();
      });
    $("select#type").on('click', function() {
        id = $(this).val();
        $('#editName').val($(this).find('option:selected').text())
        $(`div#confirm-container`).slideUp();
    });

    $(`button#deletePoint`).on('click', function () {
        $(`div#confirm-container`).slideDown();
    });

    $(`button#cancelDelete`).on('click', function() {
        $(`div#confirm-container`).slideUp();
    });

    $(`button#confirmDelete`).on('click', function() {
        deleteType(id);
        getTypes();
    });
    $('button#submitPoint').on('click', function() {
        updateType(id);
    });

    function deleteType(id) {
        console.log(id);
        $.ajax({
            url: `deleteType/${id}`,
            type: 'DELETE',
            success: function(resp) {
                console.log(resp);
                
            },
            error: function(err) {
                console.error(err);
                
            }
        })
    }

    function updateType(id) {
        _id = `${id}`;
        _name = `"${$('#editName').val()}"`;
        _data = {
            id: _id,
            name: _name
        }
        $.ajax({
            url: "updateType",
            type: "PUT",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(resp) {
                console.log(resp.response);
                getTypes();
            },
            error: function(err) {
                console.log("from error");
                console.error(err);
            }
        });
    }
});