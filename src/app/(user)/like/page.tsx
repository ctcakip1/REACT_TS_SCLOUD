'use client'
import { useState } from "react";

const LikePage = () => {
    const [name, setName] = useState("tuananh")
    return (
        <div>
            Like page : with name = {name}
        </div>
    )
}
export default LikePage;