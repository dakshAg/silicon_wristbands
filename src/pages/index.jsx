import Image from 'next/image'
import styles from './page.module.css'
import '../app/globals.css'
import MERCHI from '../app/merchi';
import React from "react";
import { merchi as sdk_merchi } from "../../sdk/javascript/merchi";
import { Product } from '../../sdk/javascript/product';
import TopBar from "../components/top-bar"
import GradButton from "../components/grad-button"
import Footer from '../components/footer';
import CartFab from '../components/cart-fab';
import Link from 'next/link';
import { useSSR } from '../utils/merchi-ssr';

export async function getServerSideProps({ req, res }) {
  const MERCHI = sdk_merchi("https://api.staging.merchi.co/", "https://websockets.staging.merchi.co/");
  return useSSR((onSuccess, onFailed) => {
    const gotProducts = (ps) => {
      //console.log(ps);
      onSuccess(ps);
    };
    MERCHI.products.get(gotProducts, onFailed, {
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
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
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

  console.log(props)
  const [products, setProducts] = React.useState(makeMerchiJsEnt("Product", props.data));


  return (
    <main className="main">
      <TopBar></TopBar>
      <div className="component_dark">
        <div>
          <h1>We do Silicone Wristbands</h1>
          <h5>We're dedicated to doing silicone wristbands - and we do them GREAT! Free online proofs and fast 12 day
            turnaround. With over 10 years experience we guarantee your satisfaction!</h5>
          <div>

            <GradButton className="button" colour="bg-primary">Visit FAQ</GradButton>
            <GradButton className="button" colour="bg-secondary">Order Now</GradButton>
          </div>
        </div>
        <div>
          <img src="images/banner2.png" alt="" />
        </div>
      </div>
      <div className={styles.component}>
        <div>
          <h2>Select a Wristband from the Choices Below</h2>
          <div className="grid_container">
            {products && products.map((product) => (
              <Link className="grid_item" href={`order/${product.id()}`}>
                <img src={product.productPrimaryImage()} alt="" />
                <h4>{product.name()}</h4>
                <p>{product.description()}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
      <div className="component">
        <div className='boxed'>
          <div>
            <img src="images/groupshot.jpeg" alt="" />
          </div>
          <div>
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
          </div>
        </div>
      </div>
      <Footer />
      <CartFab />
    </main>
  )
}
