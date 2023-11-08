import { useNavigation } from "@react-navigation/native";
import { CalendarBlank, CaretLeft, Clock, Star } from "phosphor-react-native";
import { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MovieContext } from "../../contexts/MoviesContext";

export function MyList() {
  // const { allFavoriteMovies } = useContext(MovieContext);
  const [allFavoriteMovies, setAllFavoriteMovies] = useState([])
  const { goBack, navigate } = useNavigation();

  useLayoutEffect(() => {
    AsyncStorage.getItem('@FavoriteMovies').then(res => {
      setAllFavoriteMovies(JSON.parse(res))
    })
  }, [])

  console.log('LISTA DE FAVORITOS NA MyList ', allFavoriteMovies)

  function getYear(data: string) {
    const ano = new Date(data).getFullYear();
    return ano;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <CaretLeft color="#fff" size={32} weight="thin" />
        </TouchableOpacity>
        <Text style={styles.headerText}> Filmes Favoritos: </Text>
        <View
          style={{
            width: 30,
            height: 30,
          }}
        />
      </View>

      {allFavoriteMovies.length > 0 && (
        <ScrollView style={styles.contentMyList}>
          {allFavoriteMovies.map((movie) => (
            <TouchableOpacity
              onPress={() => navigate("Details", { movieId: movie.id })}
              key={movie.id}
              style={styles.card}
            >
              <Image
                style={styles.cardImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>{movie.title}</Text>
                <View style={styles.cardInfoInfoMovie}>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Star
                      color={
                        movie.vote_average?.toFixed(1) > "7" ? "#FF8700" : "#fff"
                      }
                      size={25}
                      weight={
                        movie.vote_average?.toFixed(1) > "7"
                          ? "duotone"
                          : "light"
                      }
                    />
                    <Text
                      style={[
                        movie.vote_average?.toFixed(1) > "7"
                          ? styles.cardInfoInfoMovieContentText2
                          : styles.cardInfoInfoMovieContentText,
                      ]}
                    >
                      {movie.vote_average?.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <CalendarBlank color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {getYear(movie.release_date)}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Clock color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {movie.runtime} Minutos
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {allFavoriteMovies.length <= 0 && (
        <View style={styles.moviesEmpty}>
          <Text style={styles.moviesEmptyTitle}>
            Ainda não há filmes na lista
          </Text>
          <Text style={styles.moviesEmptyText}>
            Encontre o seu filme favorito para adicionar na lista
          </Text>
        </View>
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  moviesEmpty: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  moviesEmptyImage: {
    width: 76,
    height: 76,
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
  contentMyList: {
    width: "100%",
    padding: 20,
    gap: 25,
    marginBottom: 25,
  },
  card: {
    width: 250,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cardImage: {
    width: 110,
    height: 160,
    borderRadius: 16,
  },
  cardInfo: {
    width: 150,
    gap: 10,
  },
  cardInfoTitle: {
    color: "#Fff",
    lineHeight: 24,
    fontSize: 16,
  },
  cardInfoInfoMovie: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  cardInfoInfoMovieContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardInfoInfoMovieContentText: {
    color: "#FFF",
  },
  cardInfoInfoMovieContentText2: {
    color: "#FF8700",
    fontWeight: "700",
  },
  moviesEmptyTitle: {
    color: "#EBEBEF",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
    letterSpacing: 0.12,
    lineHeight: 35,
  },
  moviesEmptyText: {
    color: "#92929D",
    letterSpacing: 0.12,
    lineHeight: 35,
  },
});
