class Producto{
    constructor(id,nombre,precio,img,alt, cantidad){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.img = img;
        this.alt = alt;
        
    }

    aumentarCantidad(){
        this.cantidad = this.cantidad + 1
    }

    disminuirCantidad(){
        this.cantidad = this.cantidad - 1
    }

    descripcionCarrito(){
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start" alt="${this.alt}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad: ${this.cantidad}</p>
                        <p class="card-text">Precio: $${this.precio}</p>
                        <button class="buttonEliminar" id="eliminarProducto${this.id}">
                         <i class="bi bi-cart-x"></i>
                         </button>
                    </div>
                </div>
            </div>
      </div>`

    }
    

    descripcionProducto(){
        return `
        <div class="row">
            <div class="sectioncard col-lg-3 col-md-3 col-sm-6" style="width: 18rem;">
                <img src="${this.img}" class="card-img-top" alt="${this.alt}">
                <div class="card-body">
                    <h5 class="card-title text-center">${this.nombre}</h5>
                    <p class="card-text text-center">$${this.precio}</p>
                    <button type="button" class="button" id="añadirProducto${this.id}"> AGREGAR AL CARRITO </button>
                </div> 
            </div>
        </div>`
        
    }   
}

class ProductoController{
    constructor(){
        this.listaProductos =[]
    }

    agregar(producto){
        this.listaProductos.push(producto)
    }

    cargarProductos(){
        
        this.agregar(new Producto(1, "ANILLOS SILVEN YIN YANG", 25000, "Img/anillos1.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(2, "ANILLOS SILVER ZAFIRO", 25000, "Img/anillos2.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(3, "ANILLOS GOLDEN AMARU", 25000, "Img/anillos3.PNG", "Anillos para mujer", 1 ))
        this.agregar(new Producto(4, "ANILLOS GLODEN SILVI", 25000, "Img/anillos4.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(5, "ANILLOS SILVEN NOIR", 25000,  "Img/anillos5.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(6, "ANILLOS GOLDEN MELANIE", 25000, "Img/anillos6.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(7, "ANILLOS GOLDEN SHIMMERING", 25000, "Img/anillos7.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(8, "ANILLOS SILVEN GOLDEN", 25000, "Img/anillos8.PNG", "Anillos para mujer", 1 ))
        this.agregar(new Producto(9, "ANILLOS SILVEN CASCABEL", 25000, "Img/anillos9.PNG", "Anillos para mujer", 1))
        this.agregar(new Producto(10, "ANILLOS SILVEN ROMBO", 25000, "Img/anillos10.PNG", "Anillos para mujer", 1))
    }

    mostrarEnDOM(){
        let anillos = document.getElementById("anillos")

        this.listaProductos.forEach(producto => {
            anillos.innerHTML += producto.descripcionProducto();
        })

        this.listaProductos.forEach(producto => {
            const botonañadirProducto = document.getElementById(`añadirProducto${producto.id}`)

            botonañadirProducto.addEventListener("click", ()=>{
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarEnDOM()
                
            })
        })    

    }

}

class Carrito{
    constructor(){
        this.listaCarrito = []
    }

    agregar(productoAgregar){

        let existe = this.listaCarrito.some(producto => producto.id == productoAgregar.id)

        if(existe){
            let producto = this.listaCarrito.find(producto => producto.id == productoAgregar.id)
            producto.aumentarCantidad()
        } else{
            if(productoAgregar instanceof Producto){
                this.listaCarrito.push(productoAgregar)
            }
        }

        
    }

    eliminar(productoAeliminar){
        let indice = this.listaCarrito.findIndex(producto => producto.id == productoAeliminar.id)
        this.listaCarrito.splice(indice,1)
    }

    guardarEnStorage(){
        console.log(this.listaCarrito)
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)

    }

    recuperarStorage(){
        let listaCarritoJS = []
        let listaCarritoJSON = localStorage.getItem("listaCarrito")
        if (listaCarritoJSON != null){
            listaCarritoJS= JSON.parse(listaCarritoJSON) 
        }
        
        
        console.log(listaCarritoJSON)
        let listaAux = []

        listaCarritoJS.forEach(producto => {
            let nuevoProducto = new Producto(producto.id, producto.nombre, producto.precio, producto.img, producto.alt, producto.cantidad)
            listaAux.push(nuevoProducto)

        })
        this.listaCarrito = listaAux
    }

    

    mostrarEnDOM(){
        let contenedorCarrito = document.getElementById("contenedorCarrito")
        contenedorCarrito.innerHTML = ""
        this.listaCarrito.forEach(producto => {
            contenedorCarrito.innerHTML += producto.descripcionCarrito();
        })

        this.eventoEliminar()
        this.mostrarTotal()

    }

    eventoEliminar(){
        this.listaCarrito.forEach(producto => {
            const botonEliminarProducto = document.getElementById(`eliminarProducto${producto.id}`)
            botonEliminarProducto.addEventListener("click", ()=>{
                this.eliminar(producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()

            })
        })
    }

    calcularTotal(){
        return this.listaCarrito.reduce((acumulador,producto)=> acumulador + producto.precio * producto.cantidad ,0)
    }

    mostrarTotal(){
        const precioTotal = document.getElementById("precioTotal")
        precioTotal.innerText = `Precio Total: $${this.calcularTotal()}`
    }
}



const controlador = new ProductoController()
const carrito = new Carrito()
carrito.recuperarStorage()
carrito.mostrarEnDOM()
controlador.cargarProductos()
controlador.mostrarEnDOM()