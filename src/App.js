import React, { useEffect, useState } from 'react';
import './App.css'
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movieList, setMovieList] = useState([]); 
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () =>{
      //pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll()
  }, []);

  useEffect(()=>{
    const scrollListenner = () =>{
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListenner);

    return()=>{
      window.removeEventListener('scroll', scrollListenner);
    }
  }, []);

  return(
    <div className='page'>
      {/* header */}
      <Header black={blackHeader}/>

      {/* Destaque */}
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      {/* Listas */}
      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      
      {/* footer */}
      <footer>
        <p>Feito por Felipe Suguiura de Melo</p>
        <p>Direitos de imagem para Netflix</p>
        <p>Clone do Netflix consumindo API themoviedb.org</p>
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
          <img src='https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2240,c_limit/Netflix_LoadTime.gif' alt='Carregando'/>
        </div>
      }
    </div>
  )
}