const { List } = require ('../models');

const listController = {
  getAll: async function(req, res){

    try{
      const lists = await List.findAll({
        include:  {
            association: 'cards',
            include: 'tags',
        },
        order: [
          'position',
          ['cards', 'position'],
          ['cards', 'tags', 'name'],
        ]
      });
      res.json(lists);
    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }    
  },

  getOne: async function (req, res){

    try{
      const listId = req.params.id;

      const list = await List.findByPk(
        listId,
        {
          include:  {
              association: 'cards',
              include: 'tags',
          },
        },
      );

      if (list){
        res.json(list);
      }else{ 
        const errorContent = {
          error: 'List not found. Please verify the provided id.'
        };
        
        res.status(404).json(errorContent);
      }
    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }   

  },

  delete: async function (req, res) {
    try{
      const idToDelete = req.params.id;

      const numberOfDeletedRow = await List.destroy({
        where: {
          id: idToDelete,
      }
      });

      if (numberOfDeletedRow === 0){
        res.status(404).json({ "error": "List not found. Please verify the provided id." });      
      }else{
        res.status(204).json();
      }
    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  deleteAutreApproche: async function (req, res) {
    try{
      const idToDelete = req.params.id;
      const list = await List.findByPk(idToDelete);
      if (list){
        await list.destroy();
        res.status(204).json();
      }else{ 
        res.status(404).json({ "error": "List not found. Please verify the provided id." });
      }

    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  create: async function (req, res){
    try{
      let { name, position } = req.body;
      if (name === undefined){
        return res.status(400).json({ "error": "Missing body parameter: name" });
      }
      if (position !== undefined){
        if (position === "" || isNaN(position)){
          return res.status(400).json({ "error": "Invalid type: position should be a number" });
        }
      }      
        
      const insertedList = await List.create({
        position: position,
        name: name,
      });
      res.status(201).json(insertedList);
    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  update: async function(req, res){
    try{
      const idToUpdate = req.params.id;

      const list = await List.findByPk(idToUpdate);
      if (list){

        const { name, position } = req.body;

        if (position !== undefined){
          if (position === "" || isNaN(position)){
            return res.status(400).json({ "error": "Invalid type: position should be a number" });
          }
        }   

        if (position === undefined && name === undefined){
          return res.status(400).json({ "error": "Invalid body. Should provide at least a 'name' or 'position' property" });
        }

        if (position){
          list.set('position', Number(position));
        }

        if (name){
          list.set('name', name);
        }

        await list.save();

        res.json(list);
        
      }else{
        res.status(404).json({ "error": "List not found. Please verify the provided id." });
      }

    } catch (error){

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },
};

module.exports = listController;