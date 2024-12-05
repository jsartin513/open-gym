import Header from './header'
import Footer from './footer'
import LeftNav from './LeftNav'
 
export default function Layout({ children }) {
  return (
    <>
      <Header />
      <LeftNav />
      <main>{children}</main>
      <Footer />


      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 80%;
        }
      `}</style>
    </>
  )
}