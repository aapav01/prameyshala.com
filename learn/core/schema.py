import graphene
import app.accounts.schema as accounts
import app.courses.schema as courses


class Query(accounts.Query, courses.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
