import React, { useEffect, useRef, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { FaRegTrashAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { RenderHtmlContent, decryptAnswer, deleteBookmarkData } from 'src/utils'
import { getbookmarkApi, setbookmarkApi } from 'src/store/actions/campaign'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import Layout from 'src/components/Layout/Layout'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
import { bookmarkId } from 'src/store/reducers/bookmarkSlice'

const Bookmark = ({ t }) => {
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("Quizzone");
  const [quizzoneQue, setQuizzoneQue] = useState([]);
  const [guessthewordQue, setGuesstheWordQue] = useState([]);
  const [audioquizQue, setAudioQuizQue] = useState([]);
  const [visible, setVisible] = useState(5);

  const navigate = useRouter();

  const dispatch = useDispatch()

  const userData = useSelector((state) => state.User);
  const systemconfig = useSelector(sysConfigdata);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  // check if the quiz mode are unable or not
  const checkBookmarData = () => {
    if (systemconfig.quiz_zone_mode !== '1' && systemconfig.guess_the_word_question !== '1' && systemconfig.audio_mode_question !== '1') {
      toast.error('No Bookmark Questions Found')
      // navigate('/profile')
    }
  }

  // set the default key if any other quiz mode is unable
  const checkForDefaultKey = () => {
    if (systemconfig.quiz_zone_mode !== '1') {
      setKey('GuesstheWord')
    }
    if (systemconfig.guess_the_word_question !== '1') {
      setKey('AudioQuestion')
    }
    if (systemconfig.audio_mode_question !== '1') {
      setKey('Quizzone')
    }
    if (systemconfig.guess_the_word_question !== '1' && systemconfig.audio_mode_question !== '1') {
      setKey('Quizzone')
    }
  }




  // get correct answers from response data with decypt answers
  // const getCorrectAnswer = (data, decryptedAnswer) => {
  //   switch (decryptedAnswer) {
  //     case 'a':
  //       return data.optiona
  //     case 'b':
  //       return data.optionb
  //     case 'c':
  //       return data.optionc
  //     case 'd':
  //       return data.optiond
  //     default:
  //       return data.optione
  //   }
  // }

  useEffect(() => {

    checkBookmarData();
    checkForDefaultKey();

    const quizzonetype = 1;
    const guessthewordtype = 3;
    const audioquiztype = 4;


    // quizzone
    getbookmarkApi({
      type: quizzonetype,
      onSuccess: (response) => {
        // Loadbookmarkdata(response.data)
        const questions = response.data.map((data) => {

          // const decryptedAnswer = decryptAnswer(data.answer, userData?.data?.firebase_id);

          // const correctAnswer = getCorrectAnswer(data, decryptedAnswer);

          return {
            ...data,
            // correctAnswer: correctAnswer,
          };

        });

        setQuizzoneQue(questions);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      }
    });


    // guess the word
    getbookmarkApi({
      type: guessthewordtype,
      onSuccess: (response) => {
        // Loadbookmarkdata(response.data)
        const questions = response.data.map((data) => {

          return {
            ...data,
          };
        });
        setGuesstheWordQue(questions);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      }
    });

    // audio quiz
    getbookmarkApi({
      type: audioquiztype,
      onSuccess: (response) => {
        // Loadbookmarkdata(response.data)
        const questions = response.data.map((data) => {

          // const decryptedAnswer = decryptAnswer(data.answer, userData?.data?.firebase_id);

          // const correctAnswer = getCorrectAnswer(data, decryptedAnswer);

          return {
            ...data,
            // correctAnswer: correctAnswer
          };
        });
        setAudioQuizQue(questions);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }, []);

  // quizzone delete
  const quizzonedeleteBookmark = (question_id, bookmark_id) => {
    const quizzonetype = 1;
    const bookmark = "0";


    setbookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: quizzonetype,
      onSuccess: (response) => {
        const new_questions = quizzoneQue.filter((data) => {
          return data.question_id !== question_id;
        });
        setQuizzoneQue(new_questions);
        toast.success(t("Que_removed_bookmark"));
        deleteBookmarkData(bookmark_id);
      },
      onError: (error) => {
        const old_questions = quizzoneQue;
        setQuizzoneQue(old_questions);
        console.log(error);
      }
    });
  };
  // guess the word delete
  const guesstheworddeleteBookmark = (question_id, bookmark_id) => {
    const guessthewordtype = 3;
    const bookmark = "0";


    setbookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: guessthewordtype,
      onSuccess: (response) => {
        const new_questions = guessthewordQue.filter((data) => {
          return data.question_id !== question_id;
        });
        setGuesstheWordQue(new_questions);
        toast.success(t("Que_removed_bookmark"));
        deleteBookmarkData(bookmark_id);
      },
      onError: (error) => {
        const old_questions = guessthewordQue;
        setGuesstheWordQue(old_questions);
        console.log(error);
      }
    });
  };
  // audio quiz delete
  const AudioquizdeleteBookmark = (question_id, bookmark_id) => {
    const audioquiztype = 4;
    const bookmark = "0";


    setbookmarkApi({
      question_id: question_id,
      bookmark: bookmark,
      type: audioquiztype,
      onSuccess: (response) => {
        const new_questions = audioquizQue.filter((data) => {
          return data.question_id !== question_id;
        });
        setAudioQuizQue(new_questions);
        toast.success(t("Que_removed_bookmark"));
        deleteBookmarkData(bookmark_id);
      },
      onError: (error) => {
        const old_questions = audioquizQue;
        setAudioQuizQue(old_questions);
        console.log(error);
      }
    });
  };

  const handleClick = (id) => {
    navigate.push("/play-bookmark-questions/")
    dispatch(bookmarkId(id))

  }
  return (
    <Layout>
      <div className='Profile__Sec Bookmark'>
        <div className='container bookmark-data'>

          <div className='morphism morphisam'>
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 pt-2'>


                <Tabs id="fill-tab-example" activeKey={key} onSelect={(k) => setKey(k)} fill className="mb-3">

                  {systemconfig.quiz_zone_mode !== '1' ? (
                    null
                  ) :
                    <Tab eventKey="Quizzone" title={t("Quiz Zone")}>
                      <>
                        {quizzoneQue?.length > 0 && <div className='outer__stage bookmark-box d-flex justify-content-between'>
                          <span className='d-flex align-items-center'>{t('total')} {t('bookmark')} :&nbsp; <span className='fw-bold'>{quizzoneQue?.length}</span></span>
                          <button className='btn btn-primary' onClick={()=>handleClick('1')}>
                            {t('Play bookmark')}
                          </button>
                        </div>}
                        {loading ? (
                          <div className="text-center ">
                            <Skeleton count={5} />
                          </div>
                        ) : quizzoneQue?.length > 0 ? (

                          quizzoneQue.slice(0, visible).map((question, key) => {
                            return (
                              <div className="outer__stage bookmark-box" key={key}>
                                <div className="three__stage">
                                  <div className="number_stage">
                                    <span>{key + 1}</span>
                                  </div>
                                  <div className="content_stage">
                                    <p>
                                      {systemconfig.latex_mode === "1" ? <RenderHtmlContent htmlContent=
                                        {question.question}
                                      /> : question.question}
                                    </p>
                                    {/* <span>
                                      {t("answer")}:<span className="ps-2">
                                        {systemconfig.latex_mode === "1" ? <RenderHtmlContent htmlContent=
                                          {question && question.correctAnswer}
                                        /> : question && question.correctAnswer}
                                      </span>
                                    </span> */}
                                  </div>
                                  <div className="delete__stage">
                                    <button className="btn btn-primary" onClick={() => quizzonedeleteBookmark(question.question_id, question.id)}>
                                      <FaRegTrashAlt />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <h4 className="text-center mb-4 mt-5">{t("no_data_found")}</h4>
                            <div className="play__button">
                              <Link href="/" className="btn btn-primary d-block">
                                {t("back")}
                              </Link>
                            </div>
                          </>
                        )}

                        {visible < quizzoneQue?.length && (
                          <div className="col-md-12 text-center">
                            <div id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                              <span>{t("load_more")}</span>
                            </div>
                          </div>
                        )}
                      </>
                    </Tab>}

                  {systemconfig.guess_the_word_question !== '1' ? (
                    null
                  ) :
                    <Tab eventKey="GuesstheWord" title={t("Guess The Word")}>
                      <>
                      {guessthewordQue?.length > 0 && <div className='outer__stage bookmark-box d-flex justify-content-between'>
                          <span className='d-flex align-items-center'>{t('total')} {t('bookmark')} :&nbsp; <span className='fw-bold'>{guessthewordQue?.length}</span></span>
                          <button className='btn btn-primary' onClick={()=>handleClick('3')}>
                            {t('Play bookmark')}
                          </button>
                        </div>}
                        {loading ? (
                          <div className="text-center ">
                            <Skeleton count={5} />
                          </div>
                        ) : guessthewordQue?.length > 0 ? (
                          guessthewordQue.slice(0, visible).map((question, key) => {
                            return (
                              <div className="outer__stage bookmark-box" key={key}>
                                <div className="three__stage">
                                  <div className="number_stage">
                                    <span>{key + 1}</span>
                                  </div>
                                  <div className="content_stage">
                                    <p>{question.question}</p>
                                    {/* <span>
                                      {t("answer")}: <span className="ps-2">{question && question.answer}</span>
                                      {t("answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("not_att")}</span>
                                    </span> */}
                                  </div>
                                  <div className="delete__stage">
                                    <button className="btn btn-primary" onClick={() => guesstheworddeleteBookmark(question.question_id, question.id)}>
                                      <FaRegTrashAlt />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <h4 className="text-center mb-4 mt-5">{t("no_data_found")}</h4>
                            <div className="play__button">
                              <Link href="/" className="btn btn-primary d-block">
                                {t("back")}
                              </Link>
                            </div>
                          </>
                        )}

                        {visible < guessthewordQue?.length && (
                          <div className="col-md-12 text-center">
                            <div id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                              <span>{t("load_more")}</span>
                            </div>
                          </div>
                        )}
                      </>
                    </Tab>}

                  {systemconfig.audio_mode_question !== '1' ? (
                    null
                  ) :

                    <Tab eventKey="AudioQuestion" title={t("Audio Questions")}>
                      <>
                      {audioquizQue?.length > 0 && <div className='outer__stage bookmark-box d-flex justify-content-between'>
                          <span className='d-flex align-items-center'>{t('total')} {t('bookmark')} :&nbsp; <span className='fw-bold'>{audioquizQue?.length}</span></span>
                          <button className='btn btn-primary' onClick={()=>handleClick('4')}>
                            {t('Play bookmark')}
                          </button>
                        </div>}
                        {loading ? (
                          <div className="text-center ">
                            <Skeleton count={5} />
                          </div>
                        ) : audioquizQue?.length > 0 ? (
                          audioquizQue.slice(0, visible).map((question, key) => {
                            return (
                              <div className="outer__stage bookmark-box" key={key}>
                                <div className="three__stage">
                                  <div className="number_stage">
                                    <span>{key + 1}</span>
                                  </div>
                                  <div className="content_stage">
                                    <p>{question.question}</p>
                                    {/* <span>
                                      {t("answer")}: <span className="ps-2">{question && question.correctAnswer}</span>
                                      {t("answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("not_att")}</span>
                                    </span> */}
                                  </div>
                                  <div className="delete__stage">
                                    <button className="btn btn-primary" onClick={() => AudioquizdeleteBookmark(question.question_id, question.id)}>
                                      <FaRegTrashAlt />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <h4 className="text-center mb-4 mt-5">{t("no_data_found")}</h4>
                            <div className="play__button">
                              <Link href="/" className="btn btn-primary d-block">
                                {t("back")}
                              </Link>
                            </div>
                          </>
                        )}
                        {visible < audioquizQue?.length && (
                          <div className="col-md-12 text-center">
                            <div id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                              <span>{t("load_more")}</span>
                            </div>
                          </div>
                        )}
                      </>
                    </Tab>
                  }
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(Bookmark)
