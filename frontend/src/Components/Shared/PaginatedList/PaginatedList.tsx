import React, { useState } from 'react';
import s from "./PaginatedList.module.scss";

type Props = {
    numberOfItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const PaginatedList = ({currentPage, setCurrentPage, numberOfItems, itemsPerPage} : Props) => {
    const totalPages = Math.ceil(numberOfItems / itemsPerPage);
    
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={s.pagination}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
                <button
                    key={idx + 1}
                    onClick={() => goToPage(idx + 1)}
                    className={currentPage === idx + 1 ? s.active : ''}
                >
                    {idx + 1}
                </button>
            ))}

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default PaginatedList;
