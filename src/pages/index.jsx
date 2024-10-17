import '../app/globals.css';
import MERCHI from '../app/merchi';
import React from "react";
import TopBar from "../components/top-bar"
import Footer from '../components/footer';
import CartFab from '../components/cart-fab';
import Link from 'next/link';
import { useSSR } from '../utils/merchi-ssr';
import { Button, Col, Container, Row } from 'reactstrap';

export async function getServerSideProps({ req, res }) {
  return useSSR((onSuccess, onFailed) => {
    const gotProducts = (ps) => {
      onSuccess(ps);
    };
    MERCHI.products.get(
      gotProducts,
      onFailed,
      {
        publicOnly: true,
        inDomain: 9,
        embed: {
          groupVariationFields: {},
          independentVariationFields: {},
          featureImage: {}
      }
    });
  })
}
export default function Home(props) {
  function makeMerchiJsEnt(entName, data) {
    if (Array.isArray(data)) {
      const entities = data.map((v) => makeMerchiJsEnt(entName, v))
      return entities
    }
    const jobEntity = MERCHI.fromJson(new MERCHI[entName](), data);
    return jobEntity;
  }

  const [products, setProducts] = React.useState(makeMerchiJsEnt("Product", props.data));


  return (
    <main className="main">
      <TopBar />
      <div className="banner">
        <Container className='banner-inner'>
          <Row>
            <Col sm='6'>
              <h1>We do Silicone Wristbands</h1>
              <p>
                We're dedicated to doing silicone wristbands - and we do them GREAT! Free online proofs and fast 12 day
                turnaround. With over 10 years experience we guarantee your satisfaction!
              </p>
              <div className='mt-4 mb-4'>
                <Button
                  tag='a'
                  size='xl'
                  className='btn-blue mr-1'
                >
                  Visit FAQ
                </Button>
                <Button
                  tag='a'
                  size='xl'
                  className='btn-orange'
                >
                  Order Now
                </Button>
              </div>
            </Col>
            <Col sm='6'>
              <div>
                <img src="images/banner2.png" alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <div>
          <h2 className='h2 mt-4'>
            Select a Wristband from the Choices Below
          </h2>
          <div className="products-grid">
            {products && products.map((product) => (
              <Link className="product-box" href={`order/${product.id()}`}>
                <img src={product.productPrimaryImage()} alt="" />
                <div>{product.name()}</div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
      <Container>
        <div className="order-now">
          <Row>
            <Col sm='6'>
              <img
                src="images/groupshot.jpeg"
                alt="lots of silicone wristbands"
                style={{width: '100%', height: 'auto'}}
              />
            </Col>
            <Col sm='6'>
              <h2>Free online proofs, fast turnaround.</h2>
              <p>
                Silicone Wristbands Australia is the fastest and easiest way to buy custom silicone wristbands. We offer
                free online proofs, 12 day turnaround and shipping Australia wide or pickup from our office in
                Melbourne.
              </p>
              <p>
                We have the finest selection of custom rubber bracelets, custom silicone wristbands, custom rubber
                wristbands, rubber band bracelets, personalised wristbands and custom printed wristbands.
              </p>
              <p>
                For any queries or questions you can call us at (03) 9001 4888 or email at
                info@siliconewristbandsaustralia.com.au
              </p>
            </Col>
          </Row>
        </div>
      </Container>
      <Footer />
      <CartFab />
    </main>
  )
}
