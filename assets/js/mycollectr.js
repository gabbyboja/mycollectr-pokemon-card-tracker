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

            // CARDS
       
            let data = '';

            response.data.forEach(card => {

                data += `
                    <div class="card">
                        <img src="assets/images/${card.card_name}.webp" class="card-image">

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

            // BREAKDOWN
  
            let summary = `
            <div class="breakDown"><p>Breakdown</p></div>
            <div class="totalSpent br-flex"><p class="dot">Total Spent  :</p><p>₱${response.summary.totalSpent}</p></div>
            <div class="cardCount br-flex"><p class="dot">Card Count  :</p><p>${response.summary.totalCards}</p></div>
            <div class="slabCount br-flex"><p class="dot">Slab Count  :</p><p>0</p></div>
            <div class="sealedProd br-flex"><p class="dot">Sealed  :</p><p>0</p></div>
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

                const pokeLogo = document.getElementById('pokeLogo');

                pokeLogo.src = 'assets/images/pokeball_loader.gif';

                setTimeout(() => {
                    pokeLogo.src = 'assets/images/pokeball_logo.png';
                    alert(response.message);
                }, 4300);

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

function cardType(type) {

    const selection = document.querySelector('.selection');

    if (type === 'card') {
        selection.innerHTML = `
        <div class="selection-item">Mint</div>
        <div class="selection-item">NM</div>
        <div class="selection-item">LM</div>
        <div class="selection-item">MP</div>
        <div class="selection-item">HP</div>
        <div class="selection-item">DAMAGED</div>
        `;
    }
    else if  (type === 'slab') {
            selection.innerHTML = `
        <div class="psa-comp"><img src="assets/images/psa_logo.png" alt=""></div>
        <div class="beckkett-comp"><img src="assets/images/beckett_logo.jpg" alt=""></div>
        <div class="tag-comp"><img src="assets/images/tag_logo.png" alt=""></div>
        <div class="cgc-comp"><img src="assets/images/cgc_logo.png" alt=""></div>
        `;
}
    else if (type === 'sealed') {
        selection.innerHTML = ``;
}

}
