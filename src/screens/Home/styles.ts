import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#242A32',
    },

    headerContent: {
      flexDirection: 'row', // Alinha os itens na horizontal
      alignItems: 'center', // Centraliza verticalmente
    },
    logo: {
      width: 100, // Largura da imagem
      height: 120, // Altura da imagem
      marginRight: 10, // Adiciona margem à direita para separar o logo do texto
    },
    headerText: {
      fontSize: 18, // Tamanho da fonte do texto
      fontWeight: 'bold', // Negrito
      color: "#0296E5"
    },

    highlightContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    highlightText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3498db', // Cor do texto, ajuste conforme necessário
    },
    
    
    containerInput: {
        backgroundColor: "#67686D",
        height: 42,
        padding: 10,
        borderRadius: 16,
        marginTop: 24,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    input:{
      color: "#FFF",
       width: "80%",
       paddingLeft: 15,

    },

    noResults: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      marginVertical: 10,
    },
    carouselItemText: {
      color: '#fff',
      textAlign: 'center',
      marginTop: 8, // Ajuste conforme necessário
    },
  
    paginationContainer: {
      alignSelf: 'center',
      marginTop: 5, // Ajuste conforme necessário
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
    
    
  
  });