// ActorDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';
import { Clock, CalendarBlank, Star, CaretLeft } from 'phosphor-react-native';

const ActorDetailsScreen = ({ route, navigation }) => {
  const { actorId } = route.params;
  const [actorDetails, setActorDetails] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/person/${actorId}`);
        setActorDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const fetchActorMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/person/${actorId}/movie_credits`);
        setMovies(response.data.cast);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchActorDetails();
    fetchActorMovies();
  }, [actorId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft color="#fff" size={32} weight="thin" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalhes do Ator</Text>
        <View style={{ width: 30, height: 30 }} />
      </View>

      {actorDetails && (
        <View style={styles.actorDetailsContainer}>
          <Image
            style={styles.actorImage}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${actorDetails.profile_path}`,
            }}
          />
          <Text style={styles.actorName}>{actorDetails.name}</Text>
          {/* Include additional actor details as needed */}
        </View>
      )}

      {movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                // Navegue para a página de detalhes do filme
                // Certifique-se de ter a rota e o componente apropriados
              }}
              style={styles.card}
            >
              <Image
                style={styles.cardImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                }}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>{item.title}</Text>
                <View style={styles.cardInfoInfoMovie}>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Star
                      color={item.vote_average >= 7 ? '#FF8700' : '#fff'}
                      size={25}
                      weight={item.vote_average >= 7 ? 'duotone' : 'light'}
                    />
                    <Text
                      style={
                        item.vote_average >= 7
                          ? styles.cardInfoInfoMovieContentText2
                          : styles.cardInfoInfoMovieContentText
                      }
                    >
                      {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <CalendarBlank color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardInfoInfoMovieContent}>
                    <Clock color="#FFF" size={25} weight="thin" />
                    <Text style={styles.cardInfoInfoMovieContentText}>
                      {item.runtime ? `${item.runtime} Minutos` : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {movies.length <= 0 && (
        <View style={styles.moviesEmpty}>
          <Text style={styles.moviesEmptyTitle}>Nenhum filme disponível para este ator.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242A32'  },
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
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  actorDetailsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  actorImage: {
    width: 120,
    height: 180,
    borderRadius: 16,
  },
  actorName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#393E46',
  },
  cardImage: {
    width: 80,
    height: 120,
    borderRadius: 16,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  cardInfoInfoMovie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardInfoInfoMovieContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardInfoInfoMovieContentText: {
    color: '#FFF',
  },
  cardInfoInfoMovieContentText2: {
    color: '#FF8700',
    fontWeight: '700',
  },
  moviesEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moviesEmptyTitle: {
    color: '#EBEBEF',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
    letterSpacing: 0.12,
    lineHeight: 35,
  },
});

export default ActorDetailsScreen;
