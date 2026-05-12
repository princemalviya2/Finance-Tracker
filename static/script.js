async function fetchTransactions(){

    const response = await fetch("/get_transactions");

    const data = await response.json();

    const list = document.getElementById("transaction-list");

    const balance = document.getElementById("balance");

    list.innerHTML = "";

    let total = 0;

    data.forEach((item, index) => {

        const li = document.createElement("li");

        li.classList.add(item.type);

        li.innerHTML = `
            <span>
                ${item.title} : ₹${item.amount}
            </span>

            <button class="delete-btn"
            onclick="deleteTransaction(${index})">
            X
            </button>
        `;

        list.appendChild(li);

        if(item.type === "income"){
            total += Number(item.amount);
        }else{
            total -= Number(item.amount);
        }

    });

    balance.innerText = `₹${total}`;
}

async function addTransaction(){

    const title = document.getElementById("title").value;

    const amount = document.getElementById("amount").value;

    const type = document.getElementById("type").value;

    if(title === "" || amount === ""){
        alert("Please Fill All Fields");
        return;
    }

    await fetch("/add_transaction", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            title,
            amount,
            type
        })

    });

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    fetchTransactions();
}

async function deleteTransaction(index){

    await fetch(`/delete_transaction/${index}`, {
        method:"DELETE"
    });

    fetchTransactions();
}

fetchTransactions();