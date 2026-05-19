function getCards(){

    $.ajax({
        type : 'POST',
        url  : 'includes/mycollectr.php',
        data : { type: 'fetch'},
        dataType: 'json',
        cache: false,

        success: function(response){ 

            if(response.status == 'empty'){
                $("#tbody").html('');
                $("#breakDownbody").html('');
                return;
            }

            // =========================
            // CARDS
            // =========================
            let data = '';

            response.data.forEach(card => {

                data += `
                    <div class="card">
                        <img src="assets/images/${card.amount}.webp" class="card-image">

                        <div class="card-info">
                            <div class="card-name">${card.card_name}</div>
                            <div class="card-price">₱${card.amount}</div>
                            <div class="card-added-date">
                                Date Added: ${card.date_added}
                            </div>
                            <div class="card-qty">Qty: ${card.qty}</div>
                        </div>
                    </div>
                `;
            });

            $("#tbody").hide().html(data).fadeIn();

            // =========================
            // SUMMARY
            // =========================
            let summary = `
            <div class="breakDown"><p>Breakdown</p></div>
            <div class="totalSpent br-flex"><p class="dot">Total Spent  :</p><p>₱${response.summary.totalSpent}</p></div>
            <div class="cardCount br-flex"><p class="dot">Card Count  :</p><p>${response.summary.totalCards}</p></div>
            <div class="slabCount br-flex"><p class="dot">Slab Count  :</p><p>${response.summary.slabCount}</p></div>
            <div class="sealedProd br-flex"><p class="dot">Sealed  :</p><p>${response.summary.sealedProd}</p></div>
            <div class="dateStarted br-flex"><p class="dot">Date Started  :</p><p>${response.summary.firstPurchase}</p></div>
            `;

            $("#breakDownbody").hide().html(summary).fadeIn();
        }
    });
}

getCards();

function addNewCard(){
    var cardName = $("#cardName").val();
    var cardAmount = $("#cardAmount").val();
    var cardQty = $("#cardQty").val();
    var dateAdded = $("#dateAdded").val();

    if(cardName == '' || cardAmount == '' || cardQty == '' || dateAdded == ''){
        alert("Please fill in all fields.");
        return;
    }

    $.ajax({
        type : 'POST',
        url  : 'includes/mycollectr.php',
        data : {
            type: 'add',
            cardName: cardName,
            cardAmount: cardAmount,
            cardQty: cardQty,
            dateAdded: dateAdded
        },
        dataType: 'json',
        success: function(response){
            if(response.status == 'success'){
                alert(response.message);
                $("#cardName").val('');
                $("#cardAmount").val('');
                $("#cardQty").val('');
                $("#dateAdded").val('');
                getCards();
            } else {
                alert("Error adding card.");
            }
        }
    });
}

