$(function () {
    let pointsArray = [];
    let page = 1;
    getTypes();
    let $mainWindow = $('div#results');
    let itemOnPages = $('select#perPage').find('option:selected').val();

    $('select#perPage').on('change', function() {
        itemOnPages = $(this).find('option:selected').val();
    });

    $('div#result1').on('mouseenter mouseleave', function () {
        $(this).toggleClass('border').toggleClass('border-info')
            .find('#edit-container1').slideToggle()
            .find('#confirm-container1').slideUp();

    });

    $('button#search').on('click', function () {
        pointsArray = [];
        page = 1;
        getPoints();
    });
    $('button#prev').on('click', function() {
        $('button#next').parent('li').removeClass('disabled');
        page--;
        showPoints();
    });
    $('button#next').on('click', function() {
        $('button#prev').parent('li').removeClass('disabled');
        page++;
        showPoints();
    });
    function compare(a, b) {
        switch (parseInt($('select#sort').find('option:selected').val())) {
            case 0: {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
                break;
            }
            case 1: {
                if (a.name < b.name) return 1;
                if (a.name > b.name)return -1;
                return 0;
                break;
                }
            case 2: {
                if (a.address < b.address) return -1;
                if (a.name > b.name)return 1;
                return 0;
                break;
            }
            case 3: {
                if (a.address < b.address) return 1;
                if (a.name > b.name) return -1;
                return 0;
                break;
            }
        }
    }
    function showPoints() {
        $mainWindow.empty();
       
        
            pointsArray.sort(compare);
            if (pointsArray.length > itemOnPages) $('#pager').slideDown();
            else $('#pager').slideUp();
            let limit = (pointsArray.length > itemOnPages * page) ? itemOnPages : pointsArray.length;
            if (pointsArray.length < itemOnPages * page) $('button#next').parent('li').addClass('disabled');
            if (page == 1) $('button#prev').parent('li').addClass('disabled');
            for(let i = (page - 1) * itemOnPages; i < limit; i++) {
                // console.log(limit);
                $mainWindow.append(pointsArray[i].html);
                $(`div#result${pointsArray[i].id}`).on('mouseenter mouseleave touchstart touchend', function () {
                    $(this).toggleClass('border').toggleClass('border-info')
                        .find(`#edit-container${pointsArray[i].id}`).slideToggle()
                        .find(`#confirm-container${pointsArray[i].id}`).slideUp();
            
                });

                $(`button#remove${pointsArray[i].id}`).on('click', function () {
                    $(`div#confirm-container${pointsArray[i].id}`).slideDown();
                });

                $(`button#cancelDelete${pointsArray[i].id}`).on('click', function() {
                    $(`div#confirm-container${pointsArray[i].id}`).slideUp();
                });

                $(`button#confirmDelete${pointsArray[i].id}`).on('click', function() {
                    deletePoint(pointsArray[i].id);
                    getPoints();
                });

                $(`button#edit${pointsArray[i].id}`).on('click', function() {
                    localStorage.setItem('pointId',pointsArray[i].id);
                    // console.log((localStorage.getItem('pointId')));
                    window.location.href = '../pages/newPoint.html';
                });
            }
        
    }

    function deletePoint(id) {
        $.ajax({
            url: `deletePoint/${id}`,
            type: 'DELETE',
            success: function(resp) {
                console.log(resp);
            },
            error: function(err) {
                console.error(err);
                
            }
        })
    }

    function getPoints() {
        let _name = $('input#searchName').val();
        let _address = $('input#searchAddress').val();
        _pointType = ($('select#searchType').find('option:selected').val() == 0) ? 0 : $('select#searchType').find('option:selected').val();
        let _data = {
            name: `"%${_name}%"`,
            address: `"%${_address}%"`,
            pointType: _pointType,

        }
        $.ajax({
            url: 'getPoints',
            type: 'GET',
            data: _data,
            contentType: 'application/json',
            dataType: "json",
            success: function (resp) {
                // console.log(resp);
                $mainWindow.empty();
                let array = resp;
                if (array.length < 1) $mainWindow.append('no data');
                else {
                    for (let i = 0; i < array.length; i++) {
                        pointsArray.push(new GeoPoint(array[i].pointId, array[i].name, array[i].address, array[i].coordinates, array[i].pointType, array[i].comment))
                    }
                showPoints();
            }
            },
            error: function (err) {
                console.log('error getting points');
                console.error(err);
            }
        });
    }

    function getTypes() {
        $.ajax({
            url: 'getTypes',
            type: 'GET',
            success: function(resp) {
                let $select = $('select#searchType');
                $select.empty();
                console.log(resp);
                $select.append($("<option>", {
                    value: 0,
                    name: "All",
                    text: "All"
                  }));
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



    class GeoPoint {
        constructor(id, name, address, coordinates, type, comment) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.coordinates = coordinates;
            this.pointType = type;
            this.comment = comment;
            this.html = `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" id="result${id}">
            <div hidden="hidden" id='${id}'>${id}</div>
            <h4>${name}</h4>
            <p>${address}</p>
            <p>${coordinates}</p>
            <p>${type}</p>
            <p>${comment}</p>
            <div class="text-center collapse" id="edit-container${id}">
                <button type="button" class="btn btn-warning btn-sm" id="edit${id}">
                    <span class="fa fa-edit"></span>
                </button>
                <button type="button" class="btn btn-danger btn-sm" id="remove${id}">
                    <span class="fa fa-trash"></span>
                </button>
                <div class="text-center collapse" id="confirm-container${id}">
                    <br/>
                    <span>delete point?</span>
                    <button type="button" class="btn btn-success btn-sm" id="cancelDelete${id}">
                        <span>no</span>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" id="confirmDelete${id}">
                        <span>yes</span>
                    </button>
                </div>
            </div>
        </div>`;
        }
    }
});