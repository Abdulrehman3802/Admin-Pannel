const Project = require('../models/Project')
const Client = require('../models/Client')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} = require('graphql')
//Project object
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        }
    })
})
// Client object 
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})
//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //All Projects
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parents, args) {
                return Project.find()
            },
        },
        //Single Project
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parents, args) {
                return Project.findById(args.id)
            }
        },
        //All Clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parents, args) {
                return Client.find()
            },
        },
        //Single Clients
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parents, args) {
                return Client.findById(args.id)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //Add Clients
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Client.create(args)
            }
        },
        //Delete Clients
        deleteClient: {
            type: ClientType,
            args: {
              id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
               
              Project.find({ clientId: args.id }).then((projects) => {
                projects.forEach((project) => {
                  project.remove();
                });
              });
             
              return Client.findByIdAndRemove(args.id);
            },
          },
        //Add Projects
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'projectstatus',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' }
                        }
                    }),


                    defaultvalue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Project.create(args)
            }
        },
        //Delete Projects
        deleteProject: {
            type: ProjectType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },
        //Update Projects
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'projectstatusupdate',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },

                        },
                    }),
                }

            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    }
                },
                    { new: true }
                )
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})