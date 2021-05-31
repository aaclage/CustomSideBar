import * as React from 'react';
import { ISpinnerProps } from './ISpinnerProps';
import styles from './Spinner.module.scss';

export function Spinner(props: ISpinnerProps) {
    const { open } = props;
    return (
        <div>
            {(open === true) &&
                <div className={styles.loader}>

                </div>
            }
            {(false) &&
                <div>
                    <div className={styles.loader}>

                    </div>
                    <div className={styles.loaderStatus}>

                        <div className={styles.loaderStatusTop}>10/10</div>
                        <div>100%</div>
                        <div className={styles.tip}>
                            <div>File "Demo1.pdf" uploaded with success.</div>
                            <div>File "Demo2.docx" uploaded with success.</div>
                            <div>File "Demo3.pdf" uploaded with success.</div>
                            <div>File "Demo4.pdf" uploaded with success.</div>
                            <div>File "Demo5.docx" uploaded with success.</div>
                            <div>File "Demo6.pdf" uploaded with success.</div>
                            <div>File "Why do we use it.pdf" uploaded with success.</div>
                            <div>File "Why do we use it.docx" uploaded with success.</div>
                            <div>File "Where does it come from.pdf" uploaded with success.</div>
                            <div>File "Where does it come from1.pdf" uploaded with success.</div>
                        </div>

                    </div>
                    <div className={styles.closeloader}>
                        <span >X</span>
                    </div>
                </div>
            }
        </div>
    );

}