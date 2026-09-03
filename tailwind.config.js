/* Usado apenas para regenerar assets/tailwind.css localmente (veja o
   comentário no topo desse arquivo). O app em si não precisa de build —
   assets/tailwind.css já vem compilado e committado no repositório. */
module.exports = {
  darkMode: 'class',
  content: ['index.html'],
  theme: {
    extend: {
      colors: {
        brand: {50:'#eef7ff',100:'#d9edff',200:'#bce0ff',300:'#8ecdff',400:'#59b0ff',500:'#338fff',600:'#1b6ff5',700:'#1459e1',800:'#1748b6',900:'#19408f'},
        mint: {50:'#effef6',100:'#d9ffe9',200:'#b5fbd5',300:'#7bf3b5',400:'#3ce18c',500:'#14c56c',600:'#09a356',700:'#0b8047',800:'#0d653c',900:'#0c5333'}
      },
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
        display: ['Manrope','Inter','system-ui','sans-serif']
      }
    }
  }
}
