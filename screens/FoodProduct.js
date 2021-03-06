import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SectionList,ActivityIndicator,Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getProduct} from '../rest/productApi';
import { createOrder } from '../rest/ordersApi';
import AuthContext from '../navigation/AuthContext';
import { setIn } from 'formik';

import {getDeliveryOptions} from '../rest/ordersApi';


export default function foodProduct(props) {
    const [checked, setChecked] = useState("");
    const context = useContext(AuthContext)
    const [product, setProduct] = useState(null);
    const [choice, setChoice] = useState(null);
    const [supplements, setSupplements] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [others,setOthers]=useState([]);
    const [food_data,setFoodData]=useState(null);
    const [location,setLocation] =useState(null)
    const [deliveryPartner,setDeliverypartner]=useState(null);


    useEffect(() => {
        if(context.location&&context.location.location){
            setLocation({
                lat:context.location.location.latitude,
                lng:context.location.location.longitude
            })
    
    
            let _location = {lat:context.location.location.latitude,
                lng:context.location.location.longitude
    }
            getDeliveryOptions(props.route.params.partner._id,{location:_location}).then(data=>{

                setDeliverypartner(data.deliveryPartner)
            }).catch(err=>{
                console.log(err)
            })   
        }

        if (props.route.params.product) {
            getProduct(props.route.params.product._id).then(product=>{
                let _food_data=[];
               let _ingredients =[];

                product.variants.map(variant=>{
                    let data = variant.options.map(option=>{
                       
                       let index_pricing = product.pricing.findIndex(pricing=>{
                           return pricing.variantOptions.findIndex(Pricing_option=>{return Pricing_option._id==option._id})>=0
                       });
                       return {max: variant.maxSelectedOptions,min:variant.minSelectedOptions
                       ,title:variant.name,choix:option.name,price:product.pricing[index_pricing].price,_id:product.pricing[index_pricing]._id}
                    })
                    if(variant.name=='ingredient'){
                        setIngredients(data);
                        }
                    _food_data.push({data,title:variant.name})
                 })
                
                setFoodData(_food_data)
                product.total=product.basePrice
                setProduct(product);  
            })
            .catch(err=>{
                console.log(err)
                alert("error while getting product")
            })
        }
        return ()=>{setProduct(null),setChecked('');setChoice(null);setIngredients([]);setOthers([]);setSupplements([])}
    }, [props.route.params])

    const addChoice = (item) =>{
        
       if(choice&&choice._id==item._id){
            let _product={...product};
            _product.total=item.price;
            setProduct(_product);
        }
        if(choice&& choice._id!=item._id){
            let _product={...product};
            _product.total=choice.price;
            _product.total=item.price;
            setProduct(_product);

        }
        if(!choice){
            let _product={...product};
            _product.total=item.price;
            setProduct(_product);

        }
        setChecked(item);
        setChoice(item);
    }

    const addIngredients = (item) => {
        if (ingredients.findIndex(i => { return i._id == item._id }) >= 0) {

            setIngredients(ingredients.filter(i => i._id != item._id))
            let _product ={...product};
            _product.total-=item.price
            setProduct(_product)

        }
        else {
            setIngredients(ingredients => [...ingredients, item])
            let _product ={...product};
            _product.total+=item.price
            setProduct(_product)

        }

    }

    const addOthers =(item)=>{
            console.log(item)
            if (others.findIndex(i => { return i._id == item._id }) >= 0) {
                if(item.min>=others.length+1){
                    setOthers(others.filter(i => i._id != item._id))
                    let _product ={...product};
                    _product.total-=item.price
                    setProduct(_product)
                }
                else {
                    alert(`minimum required is ${others.minSelectedOptions}`)
                }
              
            }
            else {
                if(others.length < item.max){

                setOthers(others => [...others, item])
                let _product ={...product};
                _product.total+=item.price
                setProduct(_product)

            }
            else {
                alert("you can't add more")
            }
        }

        
    }
    const addSupplements = (item) => {

        if (supplements.length > 26) {
            alert("you must choose only 16");
        }
        else {

            if (supplements.findIndex(i => { return i._id == item._id }) >= 0) {
                setSupplements(supplements.filter(i => i._id != item._id))
                let _product ={...product};
                _product.total-=item.price
                setProduct(_product)
            }
            else {
                setSupplements(supplements => [...supplements, item])
                let _product ={...product};
                _product.total+=item.price
                setProduct(_product)

            }

        }

    }



    const addProduct = () => {
if (props.route.params.partner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&props.route.params.partner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00")


{
    let _ingredients = [];
        
    supplements.forEach(supp=>{_ingredients.push(supp._id)})
    ingredients.forEach(ingr=>{_ingredients.push(ingr._id)})
    others.forEach(ingr=>{_ingredients.push(ingr._id)})
    if(choice){
    _ingredients.push(choice._id);
    }
    if(_ingredients.length>0){ 
    createOrder({
        product:{...product},
        ingredients:_ingredients,
        quantity:1
    }).then(createdOrder=>{
        if(createdOrder){
            context.setBag(bag=>bag+1)

            Alert.alert(
                "",
                "food order created done !",
                [
                  { text: "OK" }
                ],
                { cancelable: false }
              );
        }
    })
    .catch(err=>{
        alert("error occured")
    })}
   
    else {
        alert("please choose at least one option")
    }


}


    }

const checkBasket =()=>{
    props.navigation.navigate("basket",{last_screen:"singleBrand"});
}
const goBack = () => {
    if(props.route.params.last=="Home"){
        props.navigation.navigate("Home",{product:product})
    }
    else {
        props.navigation.goBack()

    }    }

    if (product) {
        return (
            <View style={context.darkMode ? styles.containerDark : styles.container}>
                <View style={styles.headerImageContainer}>
                    <Image style={styles.headerImage} source={product.mainImage ? { uri: product.mainImage } : require("../assets/mixmax.jpg")} />
                    <TouchableOpacity style={styles.leftArrow} onPress={goBack}>
                        <Image style={{ width: "100%", height: "100%" }} source={require("../assets/left-arrow-dark.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={checkBasket}  style={{ position: "absolute",width: Dimensions.get("screen").height * 0.03, height: Dimensions.get("screen").height * 0.03,top: "8%", right: "2%" ,elevation:10,zIndex:50}}>
                <FontAwesome color={"white"} style={{ padding: 0, fontFamily:'Poppins',fontSize: Dimensions.get("screen").height * 0.03, }} name="shopping-bag" />


                </TouchableOpacity>
                </View>
                <View style={styles.details}>
                    <Text style={{fontFamily:'Poppins',fontSize:Dimensions.get("window").width*0.1,marginLeft:10,fontWeight:'500',letterSpacing:0.1}}>{product.name[0].toUpperCase()+product.name.slice(1)}</Text>
                    <SectionList
                        sections={food_data}
                        renderItem={({ item, index }) =>
                            <View style={styles.itemContainer}>
                                <View style={styles.itemInfo}>
                                    {
                                        item.title == "choice" ?
                                            <TouchableOpacity key={item.choix} onPress={() => addChoice(item)}>
                                                <View style={styles.RadioButton}>
                                                    <Image style={{ width: "90%", height: "90%", resizeMode: "cover" }} source={item == checked ?  require("../assets/choice_checked.png"):  require("../assets/choice_unchecked.png") } />
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity key={item.choix} onPress={() => item.title == "ingredient" ? addIngredients(item) : item.title == "supplement" ? addSupplements(item):addOthers(item)}>
                                                <View style={styles.RadioButton}>
                                                    <Image style={{ width: "90%", height: "90%", resizeMode: "cover" }} source={item.title == "ingredient" ? ingredients.findIndex(i => { return i == item }) >= 0 ? require("../assets/checkbox_checked.png") : require("../assets/checkbox_unchecked.png") : item.title == "supplement" ? supplements.findIndex(i => { return i == item }) >= 0 ? require("../assets/checkbox_checked.png") : require("../assets/checkbox_unchecked.png") :others.findIndex(i => { return i == item }) >= 0 ? require("../assets/checkbox_checked.png") : require("../assets/checkbox_unchecked.png")    } />
                                                </View>
                                            </TouchableOpacity> 
                                    }
                                    <Text style={context.darkMode ?{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 ,color:"white"} : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04,color:"black" }}>{item.choix} </Text>
                                </View >
                                <Text style={context.darkMode ?{ fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04 ,color:"white"} : { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04 }}>{item.price} dt</Text>
                            </View>}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={context.darkMode ? styles.headerSectionDark : styles.headerSection}>
                                <Text style={context.darkMode ? styles.sectionHeaderTitleDark : styles.sectionHeaderTitle}>{title}</Text>
                                {
                                    title === "SUPPLEMENTS" ?
                                        <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white", backgroundColor: "#787878" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white", backgroundColor: "#787878" }}>MAX 16</Text> :
                                        title === "CHOIX" ?
                                            <Text style={context.darkMode ?{ fontFamily:'Poppins',fontSize:Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white", backgroundColor: "#404040" }: { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white", backgroundColor: "#787878" }}>Obligatoire</Text> :
                                            null
                                }
                            </View>
                        )}
                        keyExtractor={(item, index) => item + index}
                    />
                </View>
                <View style={styles.addProductContainer}>
                    <View style={styles.cost}>
                        <View >
                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.06, fontWeight: "600",color:"white" }:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.06, fontWeight: "600" }}>Cost</Text>
                        </View>
                        <View >
                            <Text style={context.darkMode ? { fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.06 ,fontWeight: "600" ,color:"white"}:{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.06, fontWeight: "600" }}>{product.total} DT</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={!((props.route.params.partner && 
                            (props.route.params.partner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&props.route.params.partner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                            
                            &&
                            (deliveryPartner && 
                                (deliveryPartner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&deliveryPartner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                            )

    
                            
                            } style={!((props.route.params.partner && 
                                (props.route.params.partner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&props.route.params.partner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                                
                                &&
                                (deliveryPartner && 
                                    (deliveryPartner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&deliveryPartner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                                ) ? styles.addBlocked : styles.addButton} onPress={addProduct}>

                            <View style={{ height: "100%", height: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <FontAwesome color={"white"} style={{ marginRight: 8, padding: 0, fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.03, fontWeight: "700" }} name="shopping-bag" />
                                <Text style={{ fontFamily:'Poppins',fontSize: Dimensions.get("screen").width*0.04, fontWeight: "700", color: "white" }}>{((props.route.params.partner && 
                            (props.route.params.partner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&props.route.params.partner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                            
                            &&
                            (deliveryPartner && 
                                (deliveryPartner.workingHours.from <= new Date().toUTCString().split(' ')[4].split(':')[0]+":00" &&deliveryPartner.workingHours.to>= new Date().toUTCString().split(' ')[4].split(':')[0]+":00"))
                            ) ? "ADD":"partner out of service"}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>



                </View>


            </View>
        );
    }
    else {
        return (<View style={{ flex: 1, justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <ActivityIndicator size="large" color={"#2474F1"} />
        </View>)
    }

}

const styles = StyleSheet.create({
    RadioButton: {
        width: 30,
        height: 30,
    },
    addProductContainer: {
        width: "90%",
        height: "13%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    buttonContainer: {
        height: "40%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    addButton: {
        height: "80%",
        width: "94%",
        borderRadius: 8,
        backgroundColor: "#2474F1",

    },
    addBlocked:{
        height: "80%",
        width: "94%",
        borderRadius: 8,
        backgroundColor: "red",

    },
    cost: {
        height: "30%",
        marginVertical: 6,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    itemInfo: {
        width: "50%",
        flexDirection: "row",
        height: "100%",
        alignItems: "center"
    },

    itemContainer: {
        height: 32,
        width: "90%",
        alignSelf: "center",
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between",


    },
    sectionHeaderTitle: {
        color: "#313131",
        fontFamily:'Poppins',fontSize: 15,
        fontWeight: "700"
    },
    sectionHeaderTitleDark:{
        color: "white",
        fontSize: 15,
        fontWeight: "700"
    },
    headerSection: {
        height: 30,
        width: "90%",
        backgroundColor: "#ECECEC",
        alignSelf: "center",
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerSectionDark:{
        height: 30,
        width: "90%",
        backgroundColor: "#292929",
        alignSelf: "center",
        padding: 3,
        flexDirection: "row",
        justifyContent: "space-between"

    },
    details: {
        width: "100%",
        height: "35%",
        flexDirection: "column",
    },

    container: {
        backgroundColor: "#F2F6FF",
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
    
    containerDark: {
        backgroundColor: "#121212",
        flex: 1,
        flexDirection: "column",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },


    leftArrow: {
        width: Dimensions.get("screen").height * 0.03,
        height: Dimensions.get("screen").height * 0.03,
        position: "absolute",
        top: "8%",
        left: "2%",
        zIndex: 50,
        elevation: 10,



    },



    headerImageContainer: {
        width: "100%",
        height: "52%"
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },


})    
