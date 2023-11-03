import { Text, TextInput, View , FlatList, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { MagnifyingGlass } from "phosphor-react-native";
import { CardMovies } from "../../components/CardMovies";
import { api } from "../../services/api";
import { useEffect, useState } from "react"; 
import { useNavigation } from "@react-navigation/native";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}

export function Home()  {
    const [discoveryMovies, setDiscoveryMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResultsMovies] = useState<Movie[]>([]);
  const [noResults, setNoResults] = useState(false);



    useEffect (() => {
        loadMoreData();
    }, []);

    const loadMoreData = async () => {
        setLoading(true)
        const response = await api.get("/movie/popular",{
            params:{
                page,
            }
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
        setSearch(text)
        if(text.length > 2) {
            searchMovies(text);

        } else {
            setSearchResultsMovies([]);


        }

    };


    const navigation = useNavigation();

    const renderMovieItem = ({item} : { item:Movie }) => (
        <CardMovies 
        data={item} 
        onPress={() => navigation.navigate("Details", {movieId: item.id})} 
        />
    );

    const movieData = search.length > 2 ? searchResults : discoveryMovies;

    return (
        <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerText}> O que você quer assistir hoje? </Text>
        <View style={styles.containerInput}>
            <TextInput 
            placeholderTextColor={"#FFF"}
            placeholder="Buscar" style={styles.input} 
            onChangeText={handleSearch}
            value={search}
            />
            <MagnifyingGlass color="#FFF" size={25} weight="light"/>
        </View>

        {noResults && (
          <Text style={styles.noResults}>
            Nenhum filme encontrado para "{search}"
          </Text>
        )}

        </View>
        <View>
            <FlatList 
            data={movieData}
            numColumns={3}
            renderItem={renderMovieItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                padding: 35,
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