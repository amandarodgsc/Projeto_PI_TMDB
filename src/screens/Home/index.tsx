import React from "react";
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { styles } from "./styles";
import { CardMovies } from "../../components/CardMovies";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-snap-carousel";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export function Home() {
  const [discoveryMovies, setDiscoveryMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResultsMovies] = useState<Movie[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    loadMoreData();
  }, []);

  const loadMoreData = async () => {
    setLoading(true);
    const response = await api.get("/movie/popular", {
      params: {
        page,
      },
    });

    setDiscoveryMovies([...discoveryMovies, ...response.data.results]);
    setPage(page + 1);
    setLoading(false);
  };

  const searchMovies = async (query: string) => {
    setLoading(true);
    const response = await api.get("/search/movie", {
      params: {
        query,
      },
    });
    if (response.data.results.length === 0) {
      setNoResults(true);
      setLoading(false);
      setSearchResultsMovies([]);
    } else {
      setNoResults(false);
      setSearchResultsMovies(response.data.results);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      searchMovies(text);
    } else {
      setSearchResultsMovies([]);
    }
  };

  const navigation = useNavigation();

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <CardMovies data={item} onPress={() => navigation.navigate("Details", { movieId: item.id })} />
  );

  const renderCarouselItem = ({ item, index }: { item: Movie; index: number }) => (
  <View>
    <CardMovies data={item} onPress={() => navigation.navigate("Details", { movieId: item.id })} />
    <Text style={styles.carouselItemText}>{item.title}</Text>
  </View>
);

const loadMoviesByCategory = async (category: string) => {
  try {
    setLoading(true);
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: category,
        page,
      },
    });

    setDiscoveryMovies([...discoveryMovies, ...response.data.results]);
    setPage(page + 1);
    setLoading(false);
  } catch (error) {
    console.error('Erro ao buscar filmes da categoria:', error);
    setLoading(false);
  }
};
useEffect(() => {
  loadMoviesByCategory('28'); // Substitua '28' pela categoria desejada
}, []); // Executa apenas uma vez no carregamento inicial


  const movieData = search.length > 2 ? searchResults : discoveryMovies;

  
  
  return (
    <View style={styles.container}>
    <View style={styles.headerContent}>
      {/* Adicione a logo do TMDB ao lado do texto */}
      <View style={styles.headerContent}>
        <Image
          source={require("../../img/R.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>O que você quer assistir hoje?</Text>
      </View>
    </View>
    <View>
        
    
        <Carousel
          data={discoveryMovies}
          renderItem={renderCarouselItem}
          sliderWidth={460}
          itemWidth={130}
          onSnapToItem={(index) => setActiveSlide(index)}
          autoplay
          loop
          autoplayInterval={5000} // Mudar o intervalo de autoplay conforme necessário
        />
        <Pagination
          dotsLength={discoveryMovies.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={{
            // Pode customizar o estilo do ponto inativo aqui
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
        
            {/* Frase "Em destaque:" centralizada com as cores padrão do site */}
    <View style={styles.highlightContainer}>
      <Text style={styles.highlightText}>Em destaque:</Text>
    </View>

        <FlatList
        
          data={movieData}
          numColumns={3}
          renderItem={renderMovieItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 40,
            paddingBottom: 100,
          }}
          onEndReached={() => loadMoreData()}
          onEndReachedThreshold={0.5}
        />
        {loading && <ActivityIndicator size={50} color="#0296e5" />}
      </View>
    </View>
  );
}
