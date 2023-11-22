import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView } from 'react-native';
import { api } from '../../services/api';
import { BookmarkSimple, CalendarBlank, CaretLeft, Clock, Star } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { MovieContext } from '../../contexts/MoviesContext';
import YouTube from 'react-native-youtube-iframe';

// Definindo o tipo para os detalhes do filme
type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  runtime: string;
  release_date: string;
  vote_average: number;
  genres: string[];
  videos: { results: { key: string; name: string }[] }; // Ajuste para refletir a estrutura real dos vídeos
};

// Definindo o tipo para as propriedades de roteamento
type RouterProps = {
  movieId: number;
};

export function Details() {
  // Estados necessários para armazenar dados do filme, estado de carregamento, etc.
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { movieId } = route.params as RouterProps;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const { addFavoriteMovie, removeFavoriteMovie, favoriteMovies } = useContext(MovieContext);
  const [cast, setCast] = useState([]);
  const [trailers, setTrailers] = useState<{ key: string; name: string }[]>([]);

  // Efeito para carregar detalhes do filme e verificar se está nos favoritos ao montar o componente
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/movie/${movieId}`, {
          params: {
            append_to_response: 'videos',
          },
        });
        setMovieDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    // Verifica se o filme está nos favoritos
    const isMovieInFavorites = favoriteMovies.includes(movieId);
    setIsFavorite(isMovieInFavorites);

    fetchMovieDetails();
  }, [movieId, favoriteMovies]);

  // Efeito para carregar elenco e trailers
  useEffect(() => {
    const fetchMovieCast = async () => {
      try {
        const response = await api.get(`/movie/${movieId}/credits`);
        setCast(response.data.cast);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieCast();

    // Extrai trailers da resposta e atualiza o estado
    const extractedTrailers = movieDetails?.videos?.results.map((video: any) => ({
      key: video.key,
      name: video.name,
    })) || [];
    setTrailers(extractedTrailers);
  }, [movieId, movieDetails?.videos?.results]);

  // Função auxiliar para obter o ano a partir da data
  function getYear(data: string) {
    return new Date(data).getFullYear();
  }

  // Função para alternar entre adicionar/remover dos favoritos
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteMovie(movieId);
    } else {
      addFavoriteMovie(movieId);
    }
    setIsFavorite(!isFavorite);
  }

  // Função para navegar para detalhes do ator
  const navigateToActorDetails = (actorId: number) => {
    navigation.navigate("ActorDetails", { actorId: actorId });
  };

  // Renderização da UI
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft color="#fff" size={32} weight="thin" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalhes</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <BookmarkSimple color={isFavorite ? 'gold' : '#fff'} size={32} weight="thin" />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {!loading && (
        <View>
          
          {/* Imagem de fundo */}
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetails?.backdrop_path}`,
            }}
            style={styles.detailsImage}
          />
          {/* Imagem do pôster */}
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
            }}
            style={styles.detailsPosterImage}
          />

          {/* Título do filme */}
          <Text style={styles.titleMovie}>{movieDetails?.title}</Text>

          {/* Detalhes como ano, duração, classificação e gêneros */}
          <View style={styles.description}>
            <View style={styles.descriptionGroup}>
              <CalendarBlank color="#92929D" size={25} weight="thin" />
              <Text style={styles.descriptionText}>
                {getYear(movieDetails?.release_date)}
              </Text>
            </View>
            <View style={styles.descriptionGroup}>
              <Clock color="#92929D" size={25} weight="thin" />
              <Text style={styles.descriptionText}>
                {`${movieDetails?.runtime} minutos`}
              </Text>
            </View>
            <View style={styles.descriptionGroup}>
              <Star
                color={
                  movieDetails?.vote_average.toFixed(2) >= 7
                    ? "#FF8700"
                    : "#92929D"
                }
                size={25}
                weight={
                  movieDetails?.vote_average.toFixed(2) >= 7
                    ? "duotone"
                    : "thin"
                }
              />
              <Text
                style={[
                  movieDetails?.vote_average.toFixed(2) >= 7
                    ? styles.descriptionText1
                    : styles.descriptionText,
                ]}
              >
                {movieDetails?.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Gêneros do filme */}
          <View style={styles.genres}>
            {movieDetails &&
              movieDetails.genres &&
              movieDetails.genres.map((genre, index) => (
                <View key={index} style={styles.genreBubble}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
          </View>

          {/* Sinopse do filme */}
          <View style={styles.about}>
            <Text style={styles.genreBubble}>Sinopse</Text>
            <Text style={styles.aboutText}>
              {!movieDetails?.overview
                ? "Ops! Parece que esse filme ainda não tem sinopse :-("
                : movieDetails?.overview}
            </Text>
          </View>

          {/* Elenco do filme */}
          <View style={styles.castContainer}>
            <Text style={styles.genreBubble}>Elenco</Text>
            {cast.length > 0 ? (
              <FlatList
                data={cast}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => navigateToActorDetails(item.id)}>
                    <View style={styles.castItem}>
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
                        }}
                        style={styles.castImage}
                      />
                      <Text style={styles.castName}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.aboutText}>
                Nenhum dado sobre o elenco disponível.
              </Text>
            )}
          </View>
          {/* Trailers do filme */}
          {trailers.map((trailer) => (
            <YouTube
              key={trailer.key}
              apiKey="006b2e34948649813a969980105785b1"
              videoId={trailer.key}
              style={{ alignSelf: 'stretch', height: 200 }}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Estilos da Tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242A32',
  },
  header: {
    paddingTop: 30,
    height: 115,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  detailsImage: {
    position: "absolute",
    width: "100%",
    height: 210,
  },
  detailsPosterImage: {
    width: 100,
    height: 160,
    borderRadius: 16,
    left: 29,
    right: 251,
    top: 140,
  },
  titleMovie: {
    position: "absolute",
    height: 50,
    left: 140,
    right: 32,
    top: 240,
    color: "#fff",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
  },
  description: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 170,
  },
  descriptionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  descriptionText: {
    marginRight: 10,
    color: "#92929D",
  },
  descriptionText1: {
    marginRight: 10,
    color: "#FF8700",
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: "center"
  },
  genreBubble: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  about: {
    padding: 20,
  },
  aboutText: {
    color: "#fff",
    textAlign: "justify",
  },
  castContainer: {
    padding: 20,
  },
  castItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    color: '#fff',
    textAlign: 'center',
  },
});
