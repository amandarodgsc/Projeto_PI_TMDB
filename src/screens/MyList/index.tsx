import React, { useEffect, useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CalendarBlank, CaretLeft, Clock, Star } from 'phosphor-react-native';
import axios from 'axios';
import { api } from '../../services/api';

export default function MyList() {
  const [allFavoriteMovies, setAllFavoriteMovies] = useState([]);
  const [favoriteMovieDetails, setFavoriteMovieDetails] = useState([]);
  const { goBack, navigate } = useNavigation();

  const loadFavoriteMovies = async () => {
    try {
      const favoriteMoviesJSON = await AsyncStorage.getItem('@FavoriteMovies');
      if (favoriteMoviesJSON) {
        const favoriteMovies = JSON.parse(favoriteMoviesJSON);
        setAllFavoriteMovies(favoriteMovies);
        fetchFavoriteMovieDetails(favoriteMovies);
      }
    } catch (error) {
      console.error('Erro ao carregar filmes favoritos: ', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadFavoriteMovies();
    }, [])
  );

  const addFavoriteMovie = async (movieId) => {
    try {
      const favoriteMoviesJSON = await AsyncStorage.getItem('@FavoriteMovies');
      const favoriteMovies = favoriteMoviesJSON ? JSON.parse(favoriteMoviesJSON) : [];

      favoriteMovies.push(movieId);
      await AsyncStorage.setItem('@FavoriteMovies', JSON.stringify(favoriteMovies));

      // Carregue os filmes favoritos novamente após adicionar
      loadFavoriteMovies();
    } catch (error) {
      console.error('Erro ao adicionar filme favorito: ', error);
    }
  };

  const fetchFavoriteMovieDetails = async (favoriteMovies) => {
    try {
      const detailsPromises = favoriteMovies
        .filter((movieId) => movieId) // Filtrar IDs válidos (não nulos)
        .map(async (movieId) => {
          try {
            const response = await api.get(`/movie/${movieId}`);
            return response.data;
          } catch (error) {
            console.error('Erro ao buscar detalhes dos filmes: ', error);
            return null;
          }
        });

      const movieDetails = await Promise.all(detailsPromises);
      setFavoriteMovieDetails(movieDetails.filter(Boolean)); // Remova valores nulos
    } catch (error) {
      console.error('Erro ao buscar detalhes dos filmes: ', error);
    }
  }

  function getYear(data) {
    const year = new Date(data).getFullYear();
    return year;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <CaretLeft color="#fff" size={32} weight="thin" />
        </TouchableOpacity>
        <Text style={styles.headerText}> Filmes Favoritos: </Text>
        <View style={{ width: 30, height: 30 }} />
      </View>

      {favoriteMovieDetails.length > 0 && (
        <ScrollView style={styles.contentMyList}>
          {favoriteMovieDetails.map((movieDetails) => (
            <TouchableOpacity
              key={movieDetails.id}
              onPress={() => navigate('Details', { movieId: movieDetails.id })} // Correção aqui
              style={styles.card}
            >
              <Image
                style={styles.cardImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
                }}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>{movieDetails.title}</Text>
                <View style={styles.cardInfoInfoMovie}>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Star
                      color={movieDetails.vote_average >= 7 ? '#FF8700' : '#fff'}
                      size={25}
                      weight={movieDetails.vote_average >= 7 ? 'duotone' : 'light'}
                    />
                    <Text
                      style={
                        movieDetails.vote_average >= 7
                          ? styles.cardInfoInfoMovieContentText2
                          : styles.cardInfoInfoMovieContentText
                      }
                    >
                      {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <CalendarBlank color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {getYear(movieDetails.release_date)}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Clock color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {movieDetails.runtime ? `${movieDetails.runtime} Minutos` : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {favoriteMovieDetails.length <= 0 && (
        <View style={styles.moviesEmpty}>
          <Text style={styles.moviesEmptyTitle}>
            Ainda não há filmes na lista
          </Text>
          <Text style={styles.moviesEmptyText}>
            Encontre o seu filme favorito para adicionar à lista
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingTop: 30,
    height: 115,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  contentMyList: {
    width: '100%',
    padding: 20,
    gap: 25,
    marginBottom: 25,
  },
  card: {
    width: 250,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#fff',
    lineHeight: 24,
    fontSize: 16,
  },
  cardInfoInfoMovie: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardInfoInfoMovieContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardInfoInfoMovieContentText: {
    color: '#FFF',
  },
  cardInfoInfoMovieContentText2: {
    color: '#FF8700',
    fontWeight: '700',
  },
  moviesEmpty: {
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  moviesEmptyTitle: {
    color: '#EBEBEF',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
    letterSpacing: 0.12,
    lineHeight: 35,
  },
  moviesEmptyText: {
    color: '#92929D',
    letterSpacing: 0.12,
    lineHeight: 35,
  },
});
