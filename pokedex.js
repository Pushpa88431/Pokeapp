
const searchBar= document.getElementById('searchBar');
let imageList = [];
let genId;
let imageListLength;

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredImageList = imageList.filter((image) => {
        return (
          image.name.toLowerCase().includes(searchString)
        );
    });
    displayImages(filteredImageList);
});



const loadImage =  (id) => {
    try {
      genId=id;
      const url="https://pokeapi.co/api/v2/generation/"+id;
     
       fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
          .then((response) => response.json())
          .then((data) => {
            const fetchData = data.results.map((item) => {
              return fetch(item.url)
                .then((res) => res.json())
                .then((data) => {
                  return {
                    id: data.id,
                    name: data.name,
                    img: data.sprites.other['official-artwork'].front_default,
                    type: data.types.map((type) => type.type.name).join(', '),
                    height:data.height,
                    weight:data.weight
                  };
                });
            });
          
            const genData= fetch(url).then((response)=>response.json())
            .then((data)=>{
              return {
                pokeName:data.pokemon_species.map((pn)=>pn.name)
              }
            }) ;
           Promise.all(([Promise.all(fetchData),genData]))
          .then(([data1, data2])=>
            {
              
              imageList = data1.filter((item)=>data2.pokeName.includes(item.name.toLowerCase()));              
             displayImages(imageList);
             
            })
          });
      
        
    } catch (err) {
        console.error(err);
    }
};

const displayImages = (imageList) => {
  imageListLength=imageList.length;
    const cardHtml = imageList.map((image) => {
      
      return `<div class="card">
      <div class="card-body">
        <img src=${
          image.img
        } alt="${image.name}" />
      </div>
      <div class="card-footer">
        <p>${image.name}</p>
        <p>${image.type}</p>
         <span>${image.height} cm</span>          
          <span>${image.weight} kg</span> 
         </div>
      </div>`;
    }).join('');
    
  document.getElementById("result").innerHTML=`There are ${imageListLength} pokemons in generaion ${genId}`;
 document.getElementById("imageContainer").innerHTML = cardHtml;
};
//loadImage();


