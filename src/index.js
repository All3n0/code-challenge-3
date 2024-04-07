document.addEventListener('DOMContentLoaded',function(){
    function frontMovieDetails(filmId){
    fetch(`http://localhost:3000/films/${filmId}`)
    .then(response=>response.json())
    .then (data=>{
        let newpic=document.getElementById('poster');
        newpic.src=data.poster;
        let runtime=document.getElementById('runtime')
        runtime.textContent=data.runtime
        let title=document.getElementById('title')
        title.textContent=data.title
        let description=document.getElementById('film-info')
        description.textContent=data.description
        let showtime=document.getElementById('showtime')
        showtime.innerText=data.showtime
        let available=document.getElementById('ticket-num')
        let availableTickets=(data.capacity-data.tickets_sold)
        available.textContent=availableTickets
        let button=document.getElementById('buy-ticket');
        button.dataset.filmId=filmId
        button.disabled=(availableTickets===0);
        button.textContent=(availableTickets===0)?"Sold Out":"Buy Ticket";
        let filmdetails=document.getElementById('showing');
        filmdetails.classList.remove('Sold-out')
        if(availableTickets===0){
            document.getElementById('film-details').classList.add('sold-out');
        }
        });}
        

function movieDetails(){

    fetch('http://localhost:3000/films')
    .then(response=>response.json())
    .then(title=>{
        const side=document.getElementById('films');
        side.innerHTML=''
        title.forEach(movie=>{
            const newListItem=document.createElement('li')
            newListItem.textContent=movie.title
            newListItem.classList.add('film-item');
            if(movie.capacity-movie.tickets_sold===0){
                newListItem.classList.add('Sold-out')
            }
            side.append(newListItem); 
            const deletebutton=document.createElement('button');
            deletebutton.textContent='X';
            deletebutton.addEventListener('click',function(){
                deleteFilm(movie.id,newListItem);
            });
            newListItem.prepend(deletebutton);
            newListItem.addEventListener('click',function(){
                frontMovieDetails(movie.id)
            })
            newListItem.addEventListener('mouseenter',function(){
                newListItem.style.color='blue';
            });newListItem.addEventListener('mouseleave',function(){
                newListItem.style.color=''
            });
        });
        if(title.length>0){
            frontMovieDetails(title[0].id)
        }
    });
}
    
function buyTicket(filmId){
    
        fetch(`http://localhost:3000/films/${filmId}`)
        .then(response=>response.json())
        .then(data=>{
            let numberOfTickets=(data.capacity-data.tickets_sold);
            if(numberOfTickets>0){
            fetch(`http://localhost:3000/films/${filmId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                tickets_sold:(data.tickets_sold+1)
            })
        })
            .then(reponse=>reponse.json())
            .then(data=>{
                let available=document.getElementById('ticket-num')
                    available.textContent=(data.capacity-data.tickets_sold)
                let button=document.getElementById('buy-ticket');
                    button.disabled=(available.textContent==="0");
                    button.textContent=(button.disabled)?"sold Out":"Buy Ticket";
                let filmdetails=document.getElementById('showing');
                filmdetails.classList.remove('remove')
                if(button.disabled){
                     button.textContent="Sold Out";
            } 
            
            
        });
    }else{
        console.log('tickets done')
     }
    });
}
 function deleteFilm(filmId, listItem) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    
                    listItem.remove();
                } else {
                    console.error('Failed to delete film');
                }
            })
        }
movieDetails();
document.getElementById('buy-ticket').addEventListener('click',function(event){
    event.preventDefault();
    let filmId=this.dataset.filmId;
    buyTicket(filmId);
    });
});