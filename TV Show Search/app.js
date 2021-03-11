const form = document.querySelector('#tvsearch');
const imageDiv = document.querySelector('#tvimage');

const getData = async searchString => {
    const config = { params: { q: searchString } };
    const res = await axios.get('http://api.tvmaze.com/search/shows', config);
    return res.data;
}

const addImages = tvshows => {
    for (let data of tvshows) {
        if (data.show.image) {
            const image = document.createElement('img');
            image.src = data.show.image.medium;
            image.alt = data.show.name;
            imageDiv.append(image);
        } else {
            const image = document.createElement('img');
            image.alt = data.show.name;
            imageDiv.append(image);
        }
    }
}

const removeImages = () => {
    while (imageDiv.firstChild) {
        imageDiv.lastChild.remove();
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    removeImages();
    const searchString = form.elements.search.value;
    addImages(await getData(searchString));
    form.elements.search.value = '';
})