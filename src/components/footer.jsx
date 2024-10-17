import { Container } from "reactstrap";

export default function Footer() {
  // TODO add lins to pages
  return (
    <div className="footer-sc">
      <Container>
        <div className='d-flex'>
          <div>
            <div>
              <a href="">Home</a> |&nbsp;
              <a href="">Order Now</a> | &nbsp;
              <a href="">FAQ</a> | &nbsp;
              <a href="">Contact</a>
            </div>
            <div className='cc-icons-container'>
              <div className='cc-icons bitcoin' />
              <div className='cc-icons visa' />
              <div className='cc-icons mastercard' />
            </div>
          </div>
          <div className='ml-auto'>
            © Silicone Wristbands Australia. {new Date().getFullYear()} | 
            Powered by <a href='https://merchi.co' target="_blank" rel="noopener noreferrer">Merchi</a>.
          </div>
        </div>
      </Container>
    </div>
  );
}
