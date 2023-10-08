import graphene
import graphql_jwt
import app.accounts.schema as accounts
import app.blog.schema as blog
import app.courses.schema as courses


class Query(accounts.Query, blog.Query, courses.Query, graphene.ObjectType):
    pass


class Mutation(accounts.Mutation,courses.Mutation, graphene.ObjectType):
    token_auth = accounts.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
