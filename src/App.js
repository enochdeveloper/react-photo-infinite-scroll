import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [newImages, setNewImages] = useState(false);
  const mounted = useRef(false);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const pageUrl = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    
    if (query) {
      url = `${searchUrl}${clientID}${urlQuery}${pageUrl}`
    } else {
      url = `${mainUrl}${clientID}${pageUrl}`
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (query) {
        setPhotos((old_photos) => [...old_photos, ...data.results])
      } else {
        setPhotos((old_photos) => [...old_photos, ...data])
      }
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setNewImages(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, 
  [page])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (!newImages) return
    if (loading) return;

    setPage((old_page) => old_page+1);
    
  }, [newImages]);

  const event = window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 5) {
      setNewImages(true);
    }
  })

  useEffect(() => {
    window.addEventListener('scroll', event);

    return () => window.removeEventListener('scroll', event);
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query) return;

    setPhotos([]);

    if (page === 0) {
      fetchImages();
    } else {
      setPage(0);
    }
    
  }

  return (
    <main>
      <section className='search'>
        <form className="search-form">
          <input type="text" placeholder='search' className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />
          })}
        </div>
        {loading && <h2 className='loading'>loading...</h2>}
        {!loading && photos.length === 0 && <h2 className='loading'>sorry, no results found :(</h2>}
      </section>
    </main>
  );
}

export default App
