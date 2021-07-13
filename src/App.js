import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import logo from './images/logo.jpg';
import logo1 from './images/logo1.jpg';
import { NewsCards, Modal } from './components';
import useStyles from './styles';


const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: 'cd8fc9c3e2afeaf6f9de5f519d324d5c2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h4"><strong>To go back try saying:<br/></strong> Go back</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h4"><strong>To open an article try saying:<br/></strong> Open article number 3</Typography></div>
          </div>
        ) : null}
        <div>
        <strong><h1> News Buddy<img className={classes.image} src={logo} height="45px" margin="8px" marginBottom="0px" alt=" logo" /></h1></strong>

      </div>

      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">

            <br />

            <a className={classes.link} href="https://www.linkedin.com/in/nishant-srivastava-047b26186/"><LinkedInIcon fontSize='large'/><h4 style={{margin:'0px'}}>Nishant Srivastava</h4> </a>

          </Typography>

        </div>
      ) : null}
    </div>
  );
};

export default App;
