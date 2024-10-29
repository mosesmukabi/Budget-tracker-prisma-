import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();


app.use(express.json());

const client = new PrismaClient()


// create a budget - /budget
app.post('/Budget', async (req, res) => {
    try {
        const { title, quantity, price } = req.body;

        // Check if a budget with the same title already exists
        const existingBudget = await client.budget.findUnique({
            where: { title: title },
        });

        if (existingBudget) {
            return res.status(400).json({ message: "Budget with this title already exists." });
        }
        // check if title, quantity, and price are provided
        if (!title || quantity === undefined || price === undefined) {
            return res.status(400).json({ message: "Title, quantity, and price are required." });
        }

        const newBudget = await client.budget.create({
            data: {
                title: title,
                quantity: quantity,
                price: price,
            },
        });

        res.status(201).json({ message: "Budget created successfully", data: newBudget });

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});





// get all the budgets - /budget
app.get('/Budget', async(req, res) => {
    try {
        const allBudgets = await client.budget.findMany();

        if (allBudgets <= 0) {
            res.status(204).json({ message: "No budgets found." });
        } else {
            res.status(200).json({ message: "Budgets retrieved successfully.", data: allBudgets });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error."});
    }
})



//get a budget by id - /budget/:title
app.get('/Budget/:title', async (req, res) => {
    const  title = req.params.title;
    try  {
        const budget = await client.budget.findFirst({
            where: { title: title },
        });
        if (!budget) {
            return res.status(404).json({ message: `Budget with title ${title} not found.` });
        }
        res.status(200).json({
            message: "Budget retrieved successfully.",
            data: budget
        })

    } catch (error) {
        res.status(500).json({ message: "Server error."});
    }
})



//update a budget - /budget/:title
app.patch('/Budget/:title', async (req, res) => {
    const wantedTitle = req.params.title;
    const {title, quantity, price} = req.body;
    try {
        let updatedBudget;
        if (title){
            updatedBudget = await client.budget.update({
                where: { title: wantedTitle },
                data: {
                    title: title
                }
            });

        }

        if (quantity){
            updatedBudget = await client.budget.update({
                where: { title: wantedTitle },
                data: {
                    quantity:   quantity
                }
            });
            
        }
        if (price){
            updatedBudget = await client.budget.update({
                where: { title: wantedTitle },
                data: {
                    price: price
                }

            });
            
            
        }
        res.status(200).json({
            message: "Budget updated successfully.",
            data: updatedBudget
        })

    } catch (error) {
        res.status(500).json({ message: "Server error."});
    }
    
})



//delete a budget - /budget/:title
app.delete('/Budget/:title', async (req, res) => {
    const title = req.params.title;

    try{
        await client.budget.delete({
            where: { title: title },
        });
        res.status(200).json({
            message: "Budget deleted successfully."
        })

    }catch(error){
        res.status(500).json({ message: "Server error."});
    }
})




app.listen(3000, () => {
    console.log('Server listening on port 3000')
});



